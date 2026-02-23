# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_02_21_075837) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "packing_list_items", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.boolean "matched"
    t.string "name"
    t.string "priority"
    t.integer "quantity"
    t.bigint "trip_id", null: false
    t.datetime "updated_at", null: false
    t.integer "volume_points"
    t.index ["trip_id"], name: "index_packing_list_items_on_trip_id"
  end

  create_table "trips", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "destination"
    t.date "end_date"
    t.string "luggage_type"
    t.date "start_date"
    t.string "trip_type"
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.jsonb "weather_data"
    t.index ["user_id"], name: "index_trips_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email"
    t.datetime "updated_at", null: false
  end

  create_table "wardrobe_items", force: :cascade do |t|
    t.string "category"
    t.datetime "created_at", null: false
    t.integer "quantity"
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["user_id"], name: "index_wardrobe_items_on_user_id"
  end

  add_foreign_key "packing_list_items", "trips"
  add_foreign_key "trips", "users"
  add_foreign_key "wardrobe_items", "users"
end
