document.addEventListener('DOMContentLoaded', () => {
    const channelSelector = document.getElementById('sendChannel');
    const emailGroup = document.getElementById('emailGroup');
    const whatsappGroup = document.getElementById('whatsappGroup');
    
    // Promjena kanala slanja
    channelSelector.addEventListener('change', () => {
        if (channelSelector.value === 'email') {
            emailGroup.style.display = 'block';
            whatsappGroup.style.display = 'none';
        } else {
            emailGroup.style.display = 'none';
            whatsappGroup.style.display = 'block';
        }
    });

    // Slanje formulara
    document.getElementById('taskForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Podaci iz formulara
        const formData = {
            title: document.getElementById('taskTitle').value,
            message: document.getElementById('taskMessage').value,
            channel: channelSelector.value,
            recipient: channelSelector.value === 'email' 
                ? document.getElementById('email').value 
                : document.getElementById('phone').value,
            scheduleTime: document.getElementById('scheduleTime').value
        };

        // Validacija
        if (!validateInputs(formData)) return;

        // Slanje poruke
        try {
            if (formData.channel === 'whatsapp') {
                // WhatsApp slanje preko CallMeBot API-ja
                const params = new URLSearchParams({
                    phone: formData.recipient,
                    text: `${formData.title}\n\n${formData.message}`,
                    apikey: '1554421'
                });
                await fetch(`https://api.callmebot.com/whatsapp.php?${params}`);
                handleResponse(true);
            } else {
                // Email slanje preko Gmail SMTP-a
                await Email.send({
                    Host: "smtp.gmail.com",
                    Username: "planedme@gmail.com",
                    Password: "eqkm gain qqyz udqn",
                    To: formData.recipient,
                    From: "planedme@gmail.com",
                    Subject: formData.title,
                    Body: formData.message
                });
                handleResponse(true);
            }
        } catch (error) {
            showMessage('Došlo je do greške u slanju: ' + error.message, false);
        }
    });

    function validateInputs(data) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+[0-9]{10,15}$/;

        if (data.channel === 'email' && !emailRegex.test(data.recipient)) {
            showMessage('Unesite valjanu e-mail adresu', false);
            return false;
        }

        if (data.channel === 'whatsapp' && !phoneRegex.test(data.recipient)) {
            showMessage('Unesite valjani WhatsApp broj u formatu +385...', false);
            return false;
        }

        return true;
    }

    function handleResponse(success) {
        if (success) {
            showMessage('Podsjetnik uspješno postavljen!', true);
            document.getElementById('taskForm').reset();
        } else {
            showMessage('Greška pri slanju podsjetnika', false);
        }
    }

    function showMessage(text, isSuccess) {
        const statusDiv = document.getElementById('statusMessage');
        statusDiv.textContent = text;
        statusDiv.className = isSuccess ? 'success' : 'error';
        
        setTimeout(() => {
            statusDiv.textContent = '';
            statusDiv.className = '';
        }, 5000);
    }
});