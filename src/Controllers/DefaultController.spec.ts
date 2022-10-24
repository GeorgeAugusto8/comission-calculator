import { comissionsController } from './ComissionsController';
import { createRequest } from 'node-mocks-http';

describe("calculateComissions", () => {

    //test does not pass but,as i understood the problem, value returned should be 12;
    it("Vendedor deve receber bonus se atingir a meta", () => {

        var request = createRequest({
            method: 'POST',
            url: '/api/calcula-comissao',
            body: {
                "pedidos": [
                    { "vendedor": 1, "data": "2022-03-01", "valor": 100.00 },
                    { "vendedor": 1, "data": "2022-03-01", "valor": 100.00 },
                    { "vendedor": 1, "data": "2022-03-01", "valor": 100.00 },
                ]
            }
        });

        var response = [
            { "vendedor": 1, "mes": 3, valor: '6.00' },
        ]

        var commissions = comissionsController.retrunComissions(request);

        expect(commissions).toStrictEqual(response);

    })

    //question is probable missing 'não' word (Vendedor deve não receber bonus se atingir a meta)
    it("Vendedor deve não receber bonus se não atingir a meta", () => {

        var request = createRequest({
            method: 'POST',
            url: '/api/calcula-comissao',
            body: {
                "pedidos": [
                    { "vendedor": 1, "data": "2022-03-01", "valor": 100.00 }
                ]
            }
        });

        var response = [
            { "vendedor": 1, "mes": 3, valor: '1.00' },
        ]

        var commissions = comissionsController.retrunComissions(request);

        expect(commissions).toStrictEqual(response);

    })

    it("Vendedor deve receber comissao segundo a faixa", () => {

        var request = createRequest({
            method: 'POST',
            url: '/api/calcula-comissao',
            body: {
                "pedidos": [
                    { "vendedor": 1, "data": "2022-03-01", "valor": 1000.00 },
                ]
            }
        });

        var response = [
            { "vendedor": 1, "mes": 3, valor: '30.00' },
        ]

        var commissions = comissionsController.retrunComissions(request);

    expect(commissions).toStrictEqual(response);

})

})
