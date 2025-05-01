const findIndexOfCurrentWord = (textarea: HTMLTextAreaElement) => {
    const currentValue = textarea.value
    const cursorPos = textarea.selectionStart

    let startIndex = cursorPos - 1
    while (startIndex >= 0 && !/\s/.test(currentValue[startIndex])) {
        startIndex--;
    }

    return startIndex
}

export {
    findIndexOfCurrentWord
}