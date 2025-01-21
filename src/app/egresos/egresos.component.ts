import { Component, type OnInit, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { FirebaseService, type Transaction } from "../services/firebase.service"
import { Timestamp } from "@angular/fire/firestore"

@Component({
  selector: "app-egresos",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./egresos.component.html",
  styleUrls: ["./egresos.component.css"],
})
export class EgresosComponent implements OnInit {
  private firebaseService = inject(FirebaseService)

  egresos: Transaction[] = []
  nuevoEgreso = {
    date: "",
    description: "",
    amount: 0,
  }

  ngOnInit() {
    this.cargarEgresos()
  }

  async cargarEgresos() {
    this.egresos = await this.firebaseService.getTransactionsByType("expense")
  }

  async agregarEgreso() {
    if (this.nuevoEgreso.date && this.nuevoEgreso.description && this.nuevoEgreso.amount) {
      const date = new Date(this.nuevoEgreso.date)
      // Adjust for UTC-6
      date.setHours(date.getHours() - 6)

      await this.firebaseService.addTransaction({
        date: Timestamp.fromDate(date),
        description: this.nuevoEgreso.description,
        amount: this.nuevoEgreso.amount,
        type: "expense",
      })
      await this.cargarEgresos()
      this.nuevoEgreso = { date: "", description: "", amount: 0 }
    }
  }
}
