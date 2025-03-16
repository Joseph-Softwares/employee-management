#!/bin/bash

# Script to set up monitoring for the Employee Management System

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root or with sudo"
  exit 1
fi

# Install Node.js monitoring tools
echo "Installing PM2 for process management and monitoring..."
npm install -g pm2

# Install system monitoring tools
echo "Installing system monitoring tools..."
apt-get update
apt-get install -y htop iotop nmon sysstat

# Set up PM2 monitoring
echo "Setting up PM2 monitoring..."
cd /home/ubuntu/project
pm2 start index.js --name "employee-management-system" --env production

# Enable PM2 monitoring dashboard
echo "Enabling PM2 monitoring dashboard..."
pm2 install pm2-server-monit
pm2 install pm2-logrotate

# Configure PM2 to start on system boot
echo "Configuring PM2 to start on system boot..."
pm2 save
env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu

# Set up log rotation for application logs
echo "Setting up log rotation..."
cat > /etc/logrotate.d/employee-management-system <<EOF
/home/ubuntu/.pm2/logs/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 0640 ubuntu ubuntu
}
EOF

# Set up basic health check cron job
echo "Setting up health check cron job..."
cat > /etc/cron.d/healthcheck <<EOF
*/5 * * * * ubuntu curl -s http://localhost:5000/health > /dev/null || echo "Health check failed at \$(date)" >> /home/ubuntu/healthcheck.log
EOF

# Optional: Install Prometheus and Grafana for advanced monitoring
read -p "Do you want to install Prometheus and Grafana for advanced monitoring? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "Installing Prometheus..."
  apt-get install -y prometheus prometheus-node-exporter

  echo "Installing Grafana..."
  apt-get install -y apt-transport-https software-properties-common
  wget -q -O - https://packages.grafana.com/gpg.key | apt-key add -
  add-apt-repository "deb https://packages.grafana.com/oss/deb stable main"
  apt-get update
  apt-get install -y grafana

  # Configure Prometheus to scrape Node.js metrics
  cat > /etc/prometheus/prometheus.yml <<EOF
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    scrape_interval: 5s
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'node'
    scrape_interval: 5s
    static_configs:
      - targets: ['localhost:9100']

  - job_name: 'nodejs'
    scrape_interval: 5s
    static_configs:
      - targets: ['localhost:5000']
EOF

  # Start and enable Prometheus and Grafana
  systemctl restart prometheus
  systemctl enable prometheus
  systemctl start grafana-server
  systemctl enable grafana-server

  echo "Prometheus and Grafana installed and configured."
  echo "Prometheus is available at: http://localhost:9090"
  echo "Grafana is available at: http://localhost:3000 (default login: admin/admin)"
fi

echo "Monitoring setup completed successfully!"
echo "You can monitor your application using the following tools:"
echo "- PM2: Run 'pm2 monit' to see real-time process monitoring"
echo "- System: Run 'htop' to see system resource usage"
echo "- Logs: Check '/home/ubuntu/.pm2/logs/' for application logs"
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "- Prometheus: http://localhost:9090"
  echo "- Grafana: http://localhost:3000"
fi
