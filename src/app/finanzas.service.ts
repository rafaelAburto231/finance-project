import { Injectable, inject } from "@angular/core";
import { Firestore, collection, getDocs } from "@angular/fire/firestore";

export interface Transaccion {
  id?: string;
  date: {
    seconds: number;
    nanoseconds: number;
  };
  description: string;
  amount: number;
  type: "income" | "expense";
}

@Injectable({
  providedIn: "root",
})
export class FinanzasService {
  private firestore: Firestore = inject(Firestore);

  // Obtener datos mensuales por año
  async obtenerDatosMensualesPorAnio(anio: number): Promise<{ ingresos: number[]; egresos: number[] }> {
    const transactionsRef = collection(this.firestore, "transactions");
    const querySnapshot = await getDocs(transactionsRef);

    const transacciones = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Transaccion[];

    const ingresos: number[] = Array(12).fill(0);
    const egresos: number[] = Array(12).fill(0);

    transacciones.forEach((transaccion) => {
      const fecha = new Date(transaccion.date.seconds * 1000);
      const year = fecha.getFullYear();
      const month = fecha.getMonth(); // Mes en base 0 (0 = enero, 11 = diciembre)

      if (year === anio) {
        if (transaccion.type === "income") {
          ingresos[month] += transaccion.amount;
        } else if (transaccion.type === "expense") {
          egresos[month] += transaccion.amount;
        }
      }
    });

    return { ingresos, egresos };
  }

  // Calcular balance total (sin importar mes)
  async calcularBalanceTotal(): Promise<number> {
    const transactionsRef = collection(this.firestore, "transactions");
    const querySnapshot = await getDocs(transactionsRef);

    const transacciones = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Transaccion[];

    return transacciones.reduce((balance, t) => {
      return t.type === "income" ? balance + t.amount : balance - t.amount;
    }, 0);
  }

  // Obtener ingresos y egresos para un mes específico
  async obtenerTransaccionesPorTipoYMes(
    anio: number,
    mes: number
  ): Promise<{ ingresos: number; egresos: number }> {
    const transactionsRef = collection(this.firestore, "transactions");
    const querySnapshot = await getDocs(transactionsRef);

    const fechaInicio = new Date(anio, mes - 1, 1);
    const fechaFin = new Date(anio, mes, 0);
    const segundosInicio = fechaInicio.getTime() / 1000;
    const segundosFin = fechaFin.getTime() / 1000;

    let ingresos = 0;
    let egresos = 0;

    const transacciones = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Transaccion[];

    transacciones.forEach((t) => {
      if (t.date.seconds >= segundosInicio && t.date.seconds <= segundosFin) {
        if (t.type === "income") ingresos += t.amount;
        if (t.type === "expense") egresos += t.amount;
      }
    });

    return { ingresos, egresos };
  }
}
