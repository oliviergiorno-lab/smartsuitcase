import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["item", "pct", "bar", "eveningCount", "sportCount",
                    "extraBagRadio", "overAlert", "fitsAlert",
                    "extraBagSection", "extraBagCard",
                    "extraBagPct", "extraBagBar", "extraBagLabel", "extraBagUsed", "extraBagCapacity"]
  static values = { total: Number, capacity: Number }

  update() { this.recalculate() }

  incrementEvening(event) {
    const card = event.currentTarget.closest("[data-traveler-card]")
    const countEl   = card.querySelector("[data-accessories-target='eveningCount']")
    const rowOutfit = card.querySelector("[data-evening-item='outfit']")
    const rowShoes  = card.querySelector("[data-evening-item='shoes']")
    let count = parseInt(countEl.textContent) + 1
    countEl.textContent = count
    rowOutfit.querySelector("[data-qty]").textContent = count
    rowShoes.querySelector("[data-qty]").textContent  = count
    rowOutfit.style.display = "table-row"
    rowShoes.style.display  = "table-row"
    this.recalculate()
  }

  incrementEvening(event) {
    const card = event.currentTarget.closest("[data-traveler-card]")
    const countEl   = card.querySelector("[data-accessories-target='eveningCount']")
    const rowOutfit = card.querySelector("[data-evening-item='outfit']")
    const rowShoes  = card.querySelector("[data-evening-item='shoes']")
    let count = parseInt(countEl.textContent) + 1
    countEl.textContent = count

    rowOutfit.querySelector("[data-qty]").textContent = count
    rowOutfit.style.display = "table-row"

    if (count === 1) {
      rowShoes.querySelector("[data-qty]").textContent = 1
      rowShoes.style.display = "table-row"
    }

    this.recalculate()
  }

  incrementSport(event) {
    const card = event.currentTarget.closest("[data-traveler-card]")
    const countEl   = card.querySelector("[data-accessories-target='sportCount']")
    const hasBasket = card.dataset.sportHasBasket === "true"
    let count = parseInt(countEl.textContent) + 1
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
    ["sport_tshirt", "jogging", "sport_socks"].forEach(name => {
      const row = card.querySelector(`[data-sport-base-item="${name}"]`)
      if (row) {
        row.querySelector(".ssc-qty-badge").textContent = parseInt(row.dataset.baseQty) + count
      }
    })
    if (!hasBasket) {
      const rowBasket = card.querySelector("[data-sport-item='basket']")
      if (rowBasket) {
        rowBasket.style.display = count === 0 ? "none" : "table-row"
        if (count > 0) rowBasket.querySelector("[data-qty]").textContent = 1
      }
      ;["sport_tshirt", "jogging", "sport_socks"].forEach(name => {
        const row = card.querySelector(`[data-sport-item="${name}"]`)
        if (row) {
          row.style.display = count === 0 ? "none" : "table-row"
          if (count > 0) row.querySelector("[data-qty]").textContent = count
        }
      })
    }
  }

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
      return sum + (hasBasket ? count * 8 : count * 8 + 12)
    }, 0)

    const totalItems = this.totalValue + extraAccessories + extraEvening + extraSport
    const cap1       = this.capacityValue
    const over       = totalItems > cap1

    const pct1 = Math.round(Math.min(totalItems, cap1) / cap1 * 100)
    this.pctTarget.textContent = pct1 + "%"
    this.pctTarget.className   = "ssc-capacity-pct" + (over ? " over" : "")
    this.barTarget.style.width = pct1 + "%"
    this.barTarget.className   = "ssc-progress-fill" + (over ? " over" : "")

    this.overAlertTarget.style.display  = over ? "flex" : "none"
    this.fitsAlertTarget.style.display  = over ? "none" : "flex"
    this.extraBagSectionTarget.style.display = over ? "block" : "none"

    if (!over && this.hasExtraBagRadioTarget) {
      this.extraBagRadioTargets.forEach(r => r.checked = false)
      this.extraBagCardTarget.style.display = "none"
      return
    }

    const selectedRadio = this.extraBagRadioTargets.find(r => r.checked)
    if (!selectedRadio) {
      if (this.hasExtraBagCardTarget) this.extraBagCardTarget.style.display = "none"
      return
    }

    const cap2    = parseInt(selectedRadio.dataset.capacity)
    const label2  = selectedRadio.dataset.label
    const surplus = totalItems - cap1
    const pct2    = Math.round(surplus / cap2 * 100)
    const over2   = pct2 > 100

    this.extraBagCardTarget.style.display   = "block"
    this.extraBagLabelTarget.textContent    = label2
    this.extraBagUsedTarget.textContent     = surplus
    this.extraBagCapacityTarget.textContent = cap2
    this.extraBagPctTarget.textContent      = pct2 + "%"
    this.extraBagPctTarget.className        = "ssc-capacity-pct" + (over2 ? " over" : "")
    this.extraBagBarTarget.style.width      = Math.min(pct2, 100) + "%"
    this.extraBagBarTarget.className        = "ssc-progress-fill" + (over2 ? " over" : "")
  }
}
