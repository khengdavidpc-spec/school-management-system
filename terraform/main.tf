terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
  required_version = ">= 1.0"
}

provider "docker" {}

resource "docker_network" "school_network" {
  name = "school-terraform-network"
}

resource "docker_volume" "postgres_data" {
  name = "school-terraform-pgdata"
}

resource "docker_volume" "grafana_data" {
  name = "school-terraform-grafana"
}

resource "docker_container" "postgres" {
  name  = "school-terraform-postgres"
  image = "postgres:15-alpine"

  restart = "always"

  env = [
    "POSTGRES_DB=${var.db_name}",
    "POSTGRES_USER=${var.db_user}",
    "POSTGRES_PASSWORD=${var.db_password}",
  ]

  ports {
    internal = 5432
    external = 5433
  }

  volumes {
    volume_name    = docker_volume.postgres_data.name
    container_path = "/var/lib/postgresql/data"
  }

  networks_advanced {
    name = docker_network.school_network.name
  }

  healthcheck {
    test         = ["CMD-SHELL", "pg_isready -U ${var.db_user} -d ${var.db_name}"]
    interval     = "10s"
    timeout      = "5s"
    retries      = 5
    start_period = "10s"
  }
}

resource "docker_container" "redis" {
  name  = "school-terraform-redis"
  image = "redis:7-alpine"

  restart = "always"

  ports {
    internal = 6379
    external = 6380
  }

  networks_advanced {
    name = docker_network.school_network.name
  }
}

resource "docker_container" "prometheus" {
  name  = "school-terraform-prometheus"
  image = "prom/prometheus"

  restart = "always"

  ports {
    internal = 9090
    external = 9091
  }

  networks_advanced {
    name = docker_network.school_network.name
  }
}

resource "docker_container" "grafana" {
  name  = "school-terraform-grafana"
  image = "grafana/grafana"

  restart = "always"

  env = [
    "GF_SECURITY_ADMIN_PASSWORD=${var.grafana_password}",
  ]

  ports {
    internal = 3000
    external = 3002
  }

  volumes {
    volume_name    = docker_volume.grafana_data.name
    container_path = "/var/lib/grafana"
  }

  networks_advanced {
    name = docker_network.school_network.name
  }
}