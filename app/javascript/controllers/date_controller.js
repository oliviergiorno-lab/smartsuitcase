import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["startDate", "endDate"]

  connect() {
    this.updateEndDateMin()
  }

  updateEndDateMin() {
    const startDate = this.startDateTarget.value

    if (startDate) {
      this.endDateTarget.min = startDate

      // Si end_date est avant start_date, on la remet à start_date
      if (this.endDateTarget.value && this.endDateTarget.value < startDate) {
        this.endDateTarget.value = startDate
      }
    }
  }
}
