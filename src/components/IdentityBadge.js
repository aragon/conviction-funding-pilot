import React, { useEffect, useState } from 'react'
import Box from '3box'
import { IdentityBadge as Badge } from '@aragon/ui'
import { getNetworkType } from '../lib/web3-utils'

function IdentityBadge({ entity, useBox, ...props }) {
  const [boxProfile, setBoxProfile] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function getProfile() {
      const profile = await Box.getProfile(entity)
      if (!cancelled) {
        setBoxProfile(profile)
      }
    }
    getProfile()
    return () => {
      cancelled = true
    }
  }, [entity])

  return (
    <Badge
      customLabel={boxProfile?.name}
      entity={entity}
      networkType={getNetworkType()}
      {...props}
    />
  )
}

IdentityBadge.propTypes = {
  ...Badge.propTypes,
}

export default IdentityBadge
