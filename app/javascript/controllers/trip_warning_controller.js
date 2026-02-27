import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["startDate"]

  check(event) {
    event.preventDefault()

    const startDateInput = this.element.querySelector("[data-date-target='startDate']")
    if (!startDateInput || !startDateInput.value) {
      this.element.submit()
      return
    }

    const startDate = new Date(startDateInput.value)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const diffDays = Math.ceil((startDate - today) / (1000 * 60 * 60 * 24))

    if (diffDays > 4) {
      this.showModal()
    } else {
      this.element.submit()
    }
  }

  showModal() {
    const modal = document.createElement("div")
    modal.innerHTML = `
      <div id="ssc-modal-overlay" style="
        position: fixed; inset: 0;
        background: rgba(13,15,20,0.85);
        display: flex; align-items: center; justify-content: center;
        z-index: 1000; padding: 24px;
      ">
        <div style="
          background: #22263A;
          border: 1px solid #C9A84C;
          border-radius: 12px;
          padding: 32px;
          max-width: 400px;
          width: 100%;
          position: relative;
          text-align: center;
        ">
          <div style="
            position: absolute; top: 0; left: 0; right: 0;
            height: 2px;
            background: linear-gradient(90deg, #C9A84C, #3ECFB2);
            border-radius: 12px 12px 0 0;
          "></div>
          <div style="font-size: 28px; margin-bottom: 16px;">🌤️</div>
          <h3 style="
            font-family: var(--font-display);
            color: #C9A84C;
            font-size: 18px;
            margin-bottom: 12px;
          ">Météo indicative</h3>
          <p style="
            color: #F0EEE8;
            font-size: 14px;
            line-height: 1.6;
            margin-bottom: 24px;
          ">
            Votre voyage est dans plus de 4 jours. La liste générée est basée sur la météo actuelle. Pensez à mettre à jour votre trip à J-2 pour une liste encore plus précise.
          </p>
          <button id="ssc-modal-confirm" style="
            width: 100%;
            padding: 14px;
            background: #C9A84C;
            color: #0D0F14;
            border: none;
            border-radius: 8px;
            font-family: var(--font-body);
            font-size: 15px;
            font-weight: 700;
            cursor: pointer;
            letter-spacing: 0.05em;
          ">Compris, générer ma liste</button>
        </div>
      </div>
    `
    document.body.appendChild(modal)

    document.getElementById("ssc-modal-confirm").addEventListener("click", () => {
      document.getElementById("ssc-modal-overlay").remove()
      this.element.submit()
    })
  }
}
