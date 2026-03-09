import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["quantity"]
  static values = { id: Number, points: Number }

  increment() {
    const newQty = parseInt(this.quantityTarget.textContent) + 1
    this._update(newQty)
  }

  decrement() {
    const current = parseInt(this.quantityTarget.textContent)
    if (current <= 0) return
    this._update(current - 1)
  }

  async _update(quantity) {
    const oldQty = parseInt(this.quantityTarget.textContent)
    const response = await fetch(`/packing_list_items/${this.idValue}/update_quantity`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content
      },
      body: JSON.stringify({ quantity })
    })

    if (response.ok) {
      const data = await response.json()
      this.quantityTarget.textContent = data.quantity
      const delta = (data.quantity - oldQty) * this.pointsValue
      document.dispatchEvent(new CustomEvent("packing-item:updated", { detail: { delta } }))
    }
  }
}
