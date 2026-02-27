import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["item", "pct", "bar"]
  static values = { total: Number, capacity: Number }

  update() {
    const extra = this.itemTargets
      .filter(cb => cb.checked)
      .reduce((sum, cb) => sum + parseInt(cb.dataset.points), 0)

    const newTotal = this.totalValue + extra
    const pct = Math.round(newTotal / this.capacityValue * 100)
    const over = pct > 100

    this.pctTarget.textContent = pct + "%"
    this.pctTarget.className = "ssc-capacity-pct" + (over ? " over" : "")
    this.barTarget.style.width = Math.min(pct, 100) + "%"
    this.barTarget.className = "ssc-progress-fill" + (over ? " over" : "")
  }
}
