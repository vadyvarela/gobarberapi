import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { appointment } = data;
    console.log('A fila executou');

    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento Cancelado',
      template: 'cancelation',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(appointment.date, "'dia' dd 'de' MMMM', ás' H:mm'h'", {
          locale: pt,
        }),
      },
    });
  }
}

export default new CancellationMail();
