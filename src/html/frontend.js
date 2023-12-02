function sendDeleteRequest() {
    axios.delete('/reset', {
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': '1' // Replace with your JWT token
        },
    })
    .then(response => {
        console.log(response.data);
    })
    .catch(error => {
        console.error(error);
    });
}

function sendPackageUpload(event) {
    event.preventDefault(); // Prevent default form submission behavior

    const githubUrl = document.querySelector('input[name="github_url"]').value;

    // Example JSProgram string, replace it with the actual value you want to use
    const jsProgram = "if (process.argv.length === 7) {\nconsole.log('Success')\nprocess.exit(0)\n} else {\nconsole.log('Failed')\nprocess.exit(1)\n}\n";

    const requestBody = {
        JSProgram: jsProgram,
        URL: githubUrl
    };

    axios.post('/package', requestBody, {
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': '1' // Replace with your JWT token
        },
    })
    .then(response => {
        console.log(response.data);
    })
    .catch(error => {
        console.error(error);
    });
}

document.getElementById('github_Package').addEventListener('submit', sendPackageUpload);