import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["list"]

  add() {
    const index = this.listTarget.children.length
    const html = `
      <div class="traveler-row" style="display:grid; grid-template-columns: 1fr 1fr auto; gap:12px; margin-bottom:12px; align-items:center;">
        <input type="text" name="trip[travelers_attributes][${index}][name]" placeholder="Prénom" class="ssc-input">
        <select name="trip[travelers_attributes][${index}][role]" class="ssc-select">
          <option value="adult">👤 Adulte</option>
          <option value="child">👦 Enfant</option>
        </select>
        <button type="button" onclick="this.closest('.traveler-row').remove()" style="background:none; border:none; cursor:pointer; color:#E05C5C; font-size:18px; padding:0;">✕</button>
      </div>
    `
    this.listTarget.insertAdjacentHTML("beforeend", html)
  }
}
