import * as Yup from 'yup';
import Appointment from '../models/Appointments';
import User from '../models/User';

class AppointmentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { provider_id, date } = req.body;

    /*
      Check if provider id is a provider
    */
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'You con only create appointments with providers' });
    }

    const appointments = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date,
    });

    return res.json(appointments);
  }
}

export default new AppointmentController();
