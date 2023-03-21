import { Flex, Text } from '@chakra-ui/react'

interface IJSONPrettierProps {
    json: any
    tabs?: number
}
export function JSONPrettier(props: IJSONPrettierProps) {
    const { json, tabs = 0 } = props

    const keys = Object.keys(json)

    return (
        <Flex flexDirection="column">
            {keys.map((key) => (
                <details open key={key} style={{ marginLeft: tabs * 4 }}>
                    <summary style={{ fontWeight: 'bold' }}>{key}</summary>
                    <Flex>
                        {typeof json[key] === 'object' ? (
                            <JSONPrettier json={json[key]} tabs={tabs + 2} />
                        ) : (
                            <Text fontStyle={'italic'} ml={tabs * 4}>
                                {json[key]}
                            </Text>
                        )}
                    </Flex>
                </details>
            ))}
        </Flex>
    )
}
