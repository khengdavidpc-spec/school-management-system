require('dotenv').config();
const express       = require('express');
const cors          = require('cors');
const helmet        = require('helmet');
const morgan        = require('morgan');
const client        = require('prom-client');
const { sequelize } = require('./models');
const errorHandler  = require('./middleware/errorHandler');

const authRoutes       = require('./routes/authRoutes');
const studentRoutes    = require('./routes/studentRoutes');
const teacherRoutes    = require('./routes/teacherRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const classRoutes      = require('./routes/classRoutes');
const gradeRoutes      = require('./routes/gradeRoutes');

const app = express();

// Prometheus metrics
client.collectDefaultMetrics();
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// Routes
app.use('/api/auth',       authRoutes);
app.use('/api/students',   studentRoutes);
app.use('/api/teachers',   teacherRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/classes',    classRoutes);
app.use('/api/grades',     gradeRoutes);

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  const start = async () => {
    try {
      await sequelize.authenticate();
      console.log('Database connected');
      await sequelize.sync({ alter: true });
      console.log('Models synced');
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
      console.error('Failed to start:', err);
      process.exit(1);
    }
  };
  start();
}

module.exports = app;