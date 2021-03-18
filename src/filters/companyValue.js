export default function (value, display) {
    if (value) {
        switch (display) {
            case 'Spread':
            case '3MLSpread':
                value = Math.round(value);

                return (value > 0 ? ('+' + value) : value) + 'bp';

            case 'Yield':
                return value.toFixed(3) + '%';
        }
    }

    return '';
}