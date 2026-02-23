import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input", "suggestions"]

  connect() {
    this.cities = [
      "Paris", "Tokyo", "New York", "London", "Barcelona", "Rome", "Amsterdam",
      "Berlin", "Dubai", "Singapore", "Bangkok", "Istanbul", "Los Angeles",
      "Madrid", "Prague", "Vienna", "Lisbon", "Athens", "Copenhagen", "Stockholm",
      "Oslo", "Helsinki", "Brussels", "Dublin", "Edinburgh", "Sydney", "Melbourne",
      "Toronto", "Vancouver", "Montreal", "San Francisco", "Miami", "Las Vegas",
      "Chicago", "Boston", "Seattle", "Portland", "Denver", "Austin", "Nashville",
      "Reykjavik", "Zurich", "Geneva", "Lyon", "Marseille", "Nice", "Florence",
      "Venice", "Milan", "Naples", "Seville", "Valencia", "Porto", "Budapest"
    ]
  }

  filter() {
    const query = this.inputTarget.value.toLowerCase()

    if (query.length < 2) {
      this.suggestionsTarget.innerHTML = ""
      this.suggestionsTarget.classList.remove("show")
      return
    }

    const matches = this.cities.filter(city =>
      city.toLowerCase().includes(query)
    ).slice(0, 5)

    if (matches.length === 0) {
      this.suggestionsTarget.innerHTML = ""
      this.suggestionsTarget.classList.remove("show")
      return
    }

    this.suggestionsTarget.innerHTML = matches
      .map(city => `<div class="suggestion-item" data-action="click->autocomplete#select">${city}</div>`)
      .join("")

    this.suggestionsTarget.classList.add("show")
  }

  select(event) {
    this.inputTarget.value = event.target.textContent
    this.suggestionsTarget.innerHTML = ""
    this.suggestionsTarget.classList.remove("show")
  }

  hide() {
    setTimeout(() => {
      this.suggestionsTarget.classList.remove("show")
    }, 200)
  }
}
