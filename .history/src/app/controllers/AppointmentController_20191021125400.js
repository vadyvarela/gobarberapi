import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';
import Appointments from '../models/Appointments';
import User from '../models/User';
import File from '../models/File';
import Notification from '../Schema/Notification';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const appointments = await Appointments.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(appointments);
  }

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
    const checkisProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!checkisProvider) {
      return res
        .status(401)
        .json({ error: 'You con only create appointments with providers' });
    }

    /** Check for past date */
    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past date are not permited' });
    }

    /** Check date avaibality */
    const CheckAvaubilty = await Appointments.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });
    if (CheckAvaubilty) {
      return res
        .status(400)
        .json({ error: 'Appointment date is not avaibality' });
    }

    const appointments = await Appointments.create({
      user_id: req.userId,
      provider_id,
      date: hourStart,
    });

    /** Notify appointment provider  */
    await Notification.create({
      content: `Novo agendamento de Vady varela para dia 01 de novembro as 8:40hr`,
      user: provider_id,
    });

    return res.json(appointments);
  }
}

export default new AppointmentController();
