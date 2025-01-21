import { Injectable, inject } from "@angular/core"
import { Firestore, collection, addDoc, getDocs, query, where, type Timestamp } from "@angular/fire/firestore"

export interface Transaction {
  id?: string
  amount: number
  date: Timestamp
  description: string
  type: "income" | "expense"
}

@Injectable({
  providedIn: "root",
})
export class FirebaseService {
  private firestore: Firestore = inject(Firestore)

  // Add a transaction
  async addTransaction(transaction: Omit<Transaction, "id">) {
    const transactionsRef = collection(this.firestore, "transactions")
    return addDoc(transactionsRef, transaction)
  }

  // Get all transactions
  async getTransactions(): Promise<Transaction[]> {
    const transactionsRef = collection(this.firestore, "transactions")
    const querySnapshot = await getDocs(transactionsRef)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Transaction)
  }

  // Get transactions by type (income or expense)
  async getTransactionsByType(type: "income" | "expense"): Promise<Transaction[]> {
    const transactionsRef = collection(this.firestore, "transactions")
    const q = query(transactionsRef, where("type", "==", type))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Transaction)
  }
}

