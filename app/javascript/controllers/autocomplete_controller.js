import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input", "suggestions"]

  connect() {
    this.debounceTimer = null
  }

  filter() {
    const query = this.inputTarget.value.trim()

    if (query.length < 2) {
      this.suggestionsTarget.innerHTML = ""
      return
    }

    // Debounce : attend 300ms après la dernière frappe avant d'appeler l'API
    clearTimeout(this.debounceTimer)
    this.debounceTimer = setTimeout(() => {
      this.fetchCities(query)
    }, 300)
  }

  async fetchCities(query) {
  try {
    console.log("fetching:", query)
    const response = await fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5&layer=city`
    )
    const data = await response.json()
    console.log("data:", data)
    console.log("features:", data.features)

    const results = data.features.map(f => {
      const city = f.properties.name
      const country = f.properties.country
      return { label: `${city}, ${country}`, value: city }
    })

    console.log("results:", results)
    console.log("target:", this.suggestionsTarget)

    this.suggestionsTarget.innerHTML = results
      .map(r => `<div class="suggestion-item" data-action="click->autocomplete#select" data-value="${r.value}">${r.label}</div>`)
      .join("")

    console.log("innerHTML set:", this.suggestionsTarget.innerHTML)

  } catch (error) {
    console.error("Autocomplete error:", error)
  }
}

  select(event) {
    this.inputTarget.value = event.target.dataset.value || event.target.textContent
    this.suggestionsTarget.innerHTML = ""
  }

  hide() {
    setTimeout(() => {
      this.suggestionsTarget.innerHTML = ""
    }, 200)
  }
}
