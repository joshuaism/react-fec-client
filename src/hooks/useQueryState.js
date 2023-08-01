import { useCallback } from "react"
import { useNavigate, useLocation } from "react-router-dom"

import qs from "qs"

export const useQueryState = query => {
  const location = useLocation()
  const navigate = useNavigate()

  const setQuery = useCallback(
    value => {
      const queryString = qs.stringify(value,
        { skipNulls: true }
      )

      navigate(`${location.pathname}?${queryString}`)
    },
    [navigate, location, query]
  )

  return [
    qs.parse(location.search, { ignoreQueryPrefix: true }),
    setQuery,
  ]
}