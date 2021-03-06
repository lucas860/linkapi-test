import { blingApi } from '../../services/api';

import DealSchema from '../schemas/Deal';

class BlingController {
  async index(request, response) {
    const deals = await DealSchema.find();

    if (!deals) {
      return response.status(404).json({ error: 'No deals' });
    }

    return response.json(deals);
  }

  async store(request, response) {
    request.map(async (deal) => {
      const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
        <pedido>
          <cliente>
            <nome>${deal.person_id.name}</nome>
            <endereco>${
              deal.org_id.address === null
                ? 'Nenhum endereco foi informado'
                : deal.org_id.address
            }</endereco>
          </cliente>
        </pedido>
      `;

      await blingApi
        .post(
          `/pedido/?apikey=${process.env.BLING_API_KEY}&xml=${xmlContent}`, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        )
        .then(console.log(`Integração para ${deal.person_id.name} realizada!`))
        .catch((error) => console.log(error));
    });
  }
}

export default new BlingController();
