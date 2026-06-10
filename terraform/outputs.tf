output "postgres_port" {
  description = "PostgreSQL external port"
  value       = 5433
}

output "redis_port" {
  description = "Redis external port"
  value       = 6380
}

output "prometheus_url" {
  description = "Prometheus URL"
  value       = "http://localhost:9091"
}

output "grafana_url" {
  description = "Grafana URL"
  value       = "http://localhost:3002"
}

output "network_name" {
  description = "Docker network name"
  value       = docker_network.school_network.name
}