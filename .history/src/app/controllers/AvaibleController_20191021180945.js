import { startOfDay, endOfDay } from 'date-fns';
import Appointment from '../models/Appointments';

class AvaibleController {
  async index(req, res) {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Invalid Date' });
    }

    const searchDate = Number(date);

    const appointment = await Appointment.findAll({
      where: {
        provider_id: req.params.providerId;
      }
    })

    return res.json();
  }
}

export default new AvaibleController();
