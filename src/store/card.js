/*
 * @copyright Copyright (c) 2018 Julius Härtl <jus@bitgrid.net>
 *
 * @author Julius Härtl <jus@bitgrid.net>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

import { CardApi } from './../services/CardApi'
import Vue from 'vue'

const apiClient = new CardApi()

export default {
	state: {
		cards: []
	},
	getters: {
		cardsByStack: state => (id) => {
			return state.cards.filter((card) => card.stackId === id).sort((a, b) => a.order - b.order)
		},
		cardById: state => (id) => {
			return state.cards.find((card) => card.id === id)
		}
	},
	mutations: {
		clearCards(state) {
			state.cards = []
		},
		addCard(state, card) {
			let existingIndex = state.cards.findIndex(_card => _card.id === card.id)
			if (existingIndex !== -1) {
				let existingCard = state.cards.find(_card => _card.id === card.id)
				Vue.set(state.cards, existingIndex, Object.assign({}, existingCard, card))
			} else {
				state.cards.push(card)
			}
		},
		deleteCard(state, card) {
			let existingIndex = state.cards.findIndex(_card => _card.id === card.id)
			if (existingIndex !== -1) {
				state.cards.splice(existingIndex, 1)
			}
		},
		updateTitle(state, card) {
			let existingIndex = state.cards.findIndex(_card => _card.id === card.id)
			if (existingIndex !== -1) {
				state.cards[existingIndex].title = card.title
			}
		},
		assignCardToUser(state, card) {
			// let existingIndex = state.cards.findIndex(_card => _card.id === card.id)
			/* if (existingIndex !== -1) {

			} */
		},
		updateCardDesc(state, card) {
			let existingIndex = state.cards.findIndex(_card => _card.id === card.id)
			if (existingIndex !== -1) {
				state.cards[existingIndex].description = card.description
			}
		},
		updateCardDue(state, card) {
			let existingIndex = state.cards.findIndex(_card => _card.id === card.id)
			if (existingIndex !== -1) {
				state.cards[existingIndex].duedate = card.duedate
			}
		},
		updateCardLabels(state, card) {
			let existingIndex = state.cards.findIndex(_card => _card.id === card.id)
			if (existingIndex !== -1) {
				let existingCard = state.cards.find(_card => _card.id === card.id)
				existingCard.labels = card.labels
			}
		}
	},
	actions: {
		addCard({ commit }, card) {
			apiClient.addCard(card)
				.then((createdCard) => {
					commit('addCard', createdCard)
				})
		},
		updateCard({ commit }, card) {
			apiClient.updateCard(card)
				.then((updatedCard) => {
					commit('updateTitle', updatedCard)
				})
		},
		deleteCard({ commit }, card) {
			apiClient.deleteCard(card.id)
				.then((card) => {
					commit('deleteCard', card)
				})
		},
		archiveUnarchiveCard({ commit }, card) {
			let call = 'archiveCard'
			if (card.archived === false) {
				call = 'unArchiveCard'
			}

			apiClient[call](card)
				.then((card) => {
					commit('deleteCard', card)
				})
		},
		assignCardToUser({ commit }, card) {
			apiClient.assignUser(card)
				.then(() => {
					commit('assignCardToUser')
				})
		},
		addLabel({ commit }, data) {
			apiClient.assignLabelToCard(data)
				.then(() => {
					commit('updateCardLabels', data.card)
				})
		},
		removeLabel({ commit }, data) {
			apiClient.removeLabelFromCard(data)
				.then(() => {
					commit('updateCardLabels', data.card)
				})
		},
		cardUndoDelete({ commit }, card) {
			apiClient.updateCard(card)
				.then((card) => {
					commit('updateCard', card)
				})
		},
		updateCardDesc({ commit }, card) {
			apiClient.updateCard(card)
				.then((updatedCard) => {
					commit('updateCardDesc', updatedCard)
				})
		},
		updateCardDue({ commit }, card) {
			apiClient.updateCard(card)
				.then((card) => {
					commit('updateCardDue', card)
				})
		}
	}
}
