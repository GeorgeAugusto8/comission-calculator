export interface Order{
    vendedor: string,
    data : Date,
    valor: number,
    mes?: number
}

export interface Comission{
    vendedor: string,
    valor: number,
    mes: number,
    quantidadeVendasMes: number,
    valorTotalMes: number
}

export interface Goal{
    mes: number
    qtd: number
}