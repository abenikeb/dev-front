import { useGoogleReCaptcha } from 'react-google-recaptcha'

export default function Recaptcha({ onChange }) {
    const { execute } = useGoogleReCaptcha()

    const handleRecaptcha = async () => {
        const token = await execute("6Lcde0onAAAAACVjtMRWcjqcWgtmAFvrizrPMZVQ")
        onChange(token)
    }

    return <button onClick={handleRecaptcha}>Verify</button>
}
