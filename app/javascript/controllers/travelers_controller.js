import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["list", "template"]

  add() {
    const index = this.listTarget.children.length
    const html = `
      <div class="traveler-row">
        <input type="text" name="trip[travelers_attributes][${index}][name]" placeholder="Prénom" class="ssc-input">
        <select name="trip[travelers_attributes][${index}][role]" class="ssc-select">
          <option value="adult">👤 Adulte</option>
          <option value="child">👦 Enfant</option>
        </select>
      </div>
    `
    this.listTarget.insertAdjacentHTML("beforeend", html)
  }
}
