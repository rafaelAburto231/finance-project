import { Component, type OnInit, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { FirebaseService, type Transaction } from "../services/firebase.service"
import { Timestamp } from "@angular/fire/firestore"

@Component({
  selector: "app-ingresos",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./ingresos.component.html",
  styleUrls: ["./ingresos.component.css"],
})
export class IngresosComponent implements OnInit {
  private firebaseService = inject(FirebaseService)

  ingresos: Transaction[] = []
  nuevoIngreso = {
    date: "",
    description: "",
    amount: 0,
  }

  ngOnInit() {
    this.cargarIngresos()
  }

  async cargarIngresos() {
    this.ingresos = await this.firebaseService.getTransactionsByType("income")
  }

  async agregarIngreso() {
    if (this.nuevoIngreso.date && this.nuevoIngreso.description && this.nuevoIngreso.amount) {
      const date = new Date(this.nuevoIngreso.date)
      // Adjust for UTC-6
      date.setHours(date.getHours() - 6)

      await this.firebaseService.addTransaction({
        date: Timestamp.fromDate(date),
        description: this.nuevoIngreso.description,
        amount: this.nuevoIngreso.amount,
        type: "income",
      })
      await this.cargarIngresos()
      this.nuevoIngreso = { date: "", description: "", amount: 0 }
    }
  }
}

