variable "db_name" {
  description = "Database name"
  type        = string
  default     = "schooldb"
}

variable "db_user" {
  description = "Database user"
  type        = string
  default     = "schooluser"
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
  default     = "schoolpass"
}

variable "jwt_secret" {
  description = "JWT secret key"
  type        = string
  sensitive   = true
  default     = "your-super-secret-jwt-key-change-this"
}

variable "backend_port" {
  description = "Backend port"
  type        = number
  default     = 5000
}

variable "frontend_port" {
  description = "Frontend port"
  type        = number
  default     = 3000
}

variable "grafana_password" {
  description = "Grafana admin password"
  type        = string
  sensitive   = true
  default     = "admin123"
}