import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["item", "pct", "bar", "eveningCount"]
  static values = { total: Number, capacity: Number }

  update() {
    this.recalculate()
  }

  incrementEvening(event) {
    const card = event.currentTarget.closest("[data-traveler-card]")
    const countEl = card.querySelector("[data-accessories-target='eveningCount']")
    const rowOutfit = card.querySelector("[data-evening-item='outfit']")
    const rowShoes  = card.querySelector("[data-evening-item='shoes']")

    let count = parseInt(countEl.textContent)
    count += 1
    countEl.textContent = count

    rowOutfit.querySelector("[data-qty]").textContent = count
    rowShoes.querySelector("[data-qty]").textContent  = count
    rowOutfit.style.display = "table-row"
    rowShoes.style.display  = "table-row"

    this.recalculate()
  }

  decrementEvening(event) {
    const card = event.currentTarget.closest("[data-traveler-card]")
    const countEl = card.querySelector("[data-accessories-target='eveningCount']")
    const rowOutfit = card.querySelector("[data-evening-item='outfit']")
    const rowShoes  = card.querySelector("[data-evening-item='shoes']")

    let count = parseInt(countEl.textContent)
    if (count <= 0) return
    count -= 1
    countEl.textContent = count

    rowOutfit.querySelector("[data-qty]").textContent = count
    rowShoes.querySelector("[data-qty]").textContent  = count

    if (count === 0) {
      rowOutfit.style.display = "none"
      rowShoes.style.display  = "none"
    }

    this.recalculate()
  }

  recalculate() {
    const extraAccessories = this.itemTargets
      .filter(cb => cb.checked)
      .reduce((sum, cb) => sum + parseInt(cb.dataset.points), 0)

    const extraEvening = this.eveningCountTargets
      .reduce((sum, el) => sum + parseInt(el.textContent) * 16, 0)

    const newTotal = this.totalValue + extraAccessories + extraEvening
    const pct = Math.round(newTotal / this.capacityValue * 100)
    const over = pct > 100

    this.pctTarget.textContent = pct + "%"
    this.pctTarget.className = "ssc-capacity-pct" + (over ? " over" : "")
    this.barTarget.style.width = Math.min(pct, 100) + "%"
    this.barTarget.className = "ssc-progress-fill" + (over ? " over" : "")
  }
}
