const Suggestions = () => {
    const matches = []
    return (
        <div className="suggestions">
            {matches.map((item, index) => {
                return <div
                    key={index}
                    onClick={() => {
                        // replaceCurrentWord(this.innerText);
                        // suggestionsEle.style.display = 'none';
                    }}
                >

                </div>
            })}
        </div>
    )
}

export default Suggestions