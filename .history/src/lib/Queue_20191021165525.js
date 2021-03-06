import Bee from 'bee-queue';
import CancellationMail from '../app/jobs/cancellationMails'
import redisConfig from '../config/redis'

const jobs = [CancellationMail];

class Queue {
  constructor() {
    this.queues = {};

    this.init(){

    }
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = new Bee(key, {
        redis: redisConfig
      })
    })
  }
}

export default new Queue();
