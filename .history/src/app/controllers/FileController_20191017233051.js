import File from '../models/File';

class FileController {
  async store(req, res) {
    return res.json({ ok: true });
  }
}

export default new FileController();
