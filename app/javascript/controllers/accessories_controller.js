import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["item", "pct", "bar", "eveningCount", "sportCount"]
  static values = { total: Number, capacity: Number }

  update() {
    this.recalculate()
  }

  // ── Evening ──────────────────────────────────────────────
  incrementEvening(event) {
    const card = event.currentTarget.closest("[data-traveler-card]")
    const countEl  = card.querySelector("[data-accessories-target='eveningCount']")
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
    const countEl   = card.querySelector("[data-accessories-target='eveningCount']")
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

  // ── Sport ─────────────────────────────────────────────────
  incrementSport(event) {
    const card = event.currentTarget.closest("[data-traveler-card]")
    const countEl   = card.querySelector("[data-accessories-target='sportCount']")
    const hasBasket = card.dataset.sportHasBasket === "true"

    let count = parseInt(countEl.textContent)
    count += 1
    countEl.textContent = count

    this._updateSportRows(card, count, hasBasket)
    this.recalculate()
  }

  decrementSport(event) {
    const card = event.currentTarget.closest("[data-traveler-card]")
    const countEl   = card.querySelector("[data-accessories-target='sportCount']")
    const hasBasket = card.dataset.sportHasBasket === "true"

    let count = parseInt(countEl.textContent)
    if (count <= 0) return
    count -= 1
    countEl.textContent = count

    this._updateSportRows(card, count, hasBasket)
    this.recalculate()
  }

  _updateSportRows(card, count, hasBasket) {
    // Items de base (voyageur principal avec sport coché) — on incrémente leur qty
    const baseItems = ["sport_tshirt", "jogging", "sport_socks"]
    baseItems.forEach(name => {
      const row = card.querySelector(`[data-sport-base-item="${name}"]`)
      if (row) {
        const baseQty = parseInt(row.dataset.baseQty)
        row.querySelector(".ssc-qty-badge").textContent = baseQty + count
      }
    })

    // Ligne basket — uniquement pour voyageurs supp (has_basket = false)
    if (!hasBasket) {
      const rowBasket = card.querySelector("[data-sport-item='basket']")
      if (rowBasket) {
        if (count === 0) {
          rowBasket.style.display = "none"
        } else {
          rowBasket.style.display = "table-row"
          rowBasket.querySelector("[data-qty]").textContent = 1
        }
      }

      // Pour voyageurs supp, les items sport n'existent pas en base — lignes cachées à afficher
      const suppItems = ["sport_tshirt", "jogging", "sport_socks"]
      suppItems.forEach(name => {
        const row = card.querySelector(`[data-sport-item="${name}"]`)
        if (row) {
          if (count === 0) {
            row.style.display = "none"
          } else {
            row.style.display = "table-row"
            row.querySelector("[data-qty]").textContent = count
          }
        }
      })
    }
  }

  // ── Recalculate ───────────────────────────────────────────
  recalculate() {
    const extraAccessories = this.itemTargets
      .filter(cb => cb.checked)
      .reduce((sum, cb) => sum + parseInt(cb.dataset.points), 0)

    const extraEvening = this.eveningCountTargets
      .reduce((sum, el) => sum + parseInt(el.textContent) * 16, 0)

    const extraSport = this.sportCountTargets.reduce((sum, el) => {
      const card = el.closest("[data-traveler-card]")
      const hasBasket = card.dataset.sportHasBasket === "true"
      const count = parseInt(el.textContent)
      if (count === 0) return sum
      // set sans basket = 8pts, voyageur supp ajoute basket 12pts au 1er set
      const pts = hasBasket ? count * 8 : (count * 8) + 12
      return sum + pts
    }, 0)

    const newTotal = this.totalValue + extraAccessories + extraEvening + extraSport
    const pct = Math.round(newTotal / this.capacityValue * 100)
    const over = pct > 100

    this.pctTarget.textContent = pct + "%"
    this.pctTarget.className = "ssc-capacity-pct" + (over ? " over" : "")
    this.barTarget.style.width = Math.min(pct, 100) + "%"
    this.barTarget.className = "ssc-progress-fill" + (over ? " over" : "")
  }
}
