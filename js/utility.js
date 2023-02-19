function limitValue(value, min, max)
{
    return Math.min(Math.max(value, min), max);
}

function exportJSON(data, filename) 
{
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], 
        { type: 'application/json' }));
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}