import { Request, Response } from "express";
import moment from 'moment';
import { Goal, Order, Comission } from '../Types/ComissionsController.types';

class ComissionsController {
    //did not translate to be equal to doc array;
    private metas: Array<Goal> = [
        { mes: 1, qtd: 5 },
        { mes: 2, qtd: 3 },
        { mes: 3, qtd: 2 },
        { mes: 4, qtd: 2 },
        { mes: 5, qtd: 5 },
        { mes: 6, qtd: 60 },
        { mes: 8, qtd: 2 },
        { mes: 9, qtd: 4 },
        { mes: 10, qtd: 4 },
        { mes: 11, qtd: 7 },
        { mes: 12, qtd: 2 }
    ];

    private returnOrderComission = (order: Order): number => {
        if (order.valor > 1000) return order.valor * 0.05;
        else if (order.valor >= 300) return order.valor * 0.03;
        else return order.valor * 0.01;
    }

    private sellerAndMonthMatch = (commission: Comission, order: Order): boolean =>
        commission.vendedor === order.vendedor && commission.mes === order.mes;

    private checkCommissionsGoals = (commissions: Array<Comission>): void => {
        commissions.forEach((commission: any) => {
            //once the array is ordered by month, made this way to avoid other cicle run, otherwhise would use the find method;
            if (commission.quantidadeVendasMes >= this.metas[commission.mes - 1].qtd) {
                commission.valor += (commission.valorTotalMes * 0.03)
            }
        });
    }

    private formatComissions = (commissions: Array<Comission>): void => {
        commissions.forEach((commission: any) => {
            delete commission.quantidadeVendasMes;
            delete commission.valorTotalMes;

            commission.valor = commission.valor.toFixed(2);
        });
    }

    private mapComissions = (req: Request): Array<Comission> => {
        let commissions: any = [];

        req.body.pedidos.forEach((order: any) => {
            order.mes = moment(order.data).month() + 1;

            let orderComission = this.returnOrderComission(order);

            let sellerAndMonthRegistered = false;
            commissions.forEach((commission: Comission, index: number) => {
                if (this.sellerAndMonthMatch(commission, order)) {
                    commissions[index].valor += orderComission;
                    commissions[index].quantidadeVendasMes += 1;
                    commissions[index].valorTotalMes += order.valor;
                    sellerAndMonthRegistered = true;
                };
            });

            if (!sellerAndMonthRegistered) {
                commissions.push(
                    { vendedor: order.vendedor, valor: orderComission, mes: order.mes, quantidadeVendasMes: 1, valorTotalMes: order.valor }
                );
            }

            sellerAndMonthRegistered = false;
        });

        return commissions;
    }

    public retrunComissions = (req: Request): Array<Comission> => {
        let commissions = this.mapComissions(req);
        this.checkCommissionsGoals(commissions);
        this.formatComissions(commissions);
        return commissions;
    }

    public calculateComissions = (req: Request, res: Response) => {
        try {
            let commissions = this.retrunComissions(req);
            return res.status(200).send({ comissoes: commissions });
        } catch (e: any) {
            console.log(e.message)
            return res.status(500).json({ mensagem: 'Falha ao processar requisição', error: e.message });
        }
    };

}

export const comissionsController = new ComissionsController();
