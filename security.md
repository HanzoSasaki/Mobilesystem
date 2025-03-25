

## **Proteção Ponta a Ponta do Software – Moras & Barbosa**  

### 📌 **Visão Geral**  
Este projeto adota uma abordagem **de segurança avançada** para garantir que o software funcione **exclusivamente em ambientes autorizados**, impedindo cópias não autorizadas e acessos indevidos. Para isso, utilizamos uma **Intranet personalizada** e um **sistema de verificação de IP em Assembly**, garantindo que apenas dispositivos dentro da rede interna da empresa tenham acesso ao sistema.  

---

## 🔒 **O que é uma Intranet e por que usá-la?**  
Uma **Intranet** é uma rede privada utilizada dentro de uma organização. Diferente da Internet, ela é **restrita e acessível apenas para dispositivos e usuários internos**, proporcionando maior segurança e controle sobre os dados.  

### **Vantagens de uma Intranet Personalizada:**  
✅ **Maior Segurança** – Apenas dispositivos dentro da empresa podem acessar o software.  
✅ **Controle Total** – Restringe conexões externas, evitando vazamentos de dados.  
✅ **Desempenho Aprimorado** – Comunicação rápida e eficiente dentro da rede corporativa.  
✅ **Monitoramento e Logs** – Registra e controla o acesso dos usuários.  

---

## 🏢 **Implementação da Intranet Personalizada**  
A Intranet do sistema **Moras & Barbosa** é projetada para rodar apenas dentro da infraestrutura da empresa, garantindo que **nenhuma cópia externa seja executada**.  

### **1️⃣ Configuração da Intranet**  
- O software é hospedado em **servidores internos** que não possuem acesso direto à Internet.  
- O acesso ao sistema é feito apenas por dispositivos conectados à **rede local (LAN)**.  
- As permissões são gerenciadas por um **servidor de autenticação interno**, garantindo que apenas usuários autorizados possam acessar.  

### **2️⃣ Bloqueio de Acesso Externo**  
- Firewalls configurados para bloquear qualquer solicitação de fora da rede.  
- Requisições HTTPS bloqueadas caso venham de IPs não reconhecidos.  
- Integração com **VPNs internas** para permitir acesso remoto seguro quando necessário.  

---

## 🛡️ **Verificação de IP com Assembly**  
Para evitar falsificações de IP e acessos não autorizados, o software conta com um módulo em **Assembly** que verifica se o IP do dispositivo pertence à rede interna.  

### **🔍 Como funciona?**  
✔️ O software coleta o IP da máquina e faz um **cálculo binário de validação**.  
✔️ Ele compara o IP com a faixa de endereços autorizados da Intranet.  
✔️ Se o IP não for reconhecido, o software **encerra imediatamente**.  
✔️ O código Assembly roda **sem ser compartilhado no repositório**, evitando engenharia reversa.  

---

## 🚀 **Benefícios da Proteção Implementada**  
🔒 **Prevenção contra cópias ilegais** – Apenas a Intranet da empresa pode rodar o software.  
🔍 **Segurança reforçada com verificação de IP** – Proteção em nível binário.  
🛑 **Impedimento de engenharia reversa** – Código Assembly não distribuído publicamente.  
⚡ **Execução rápida e segura** – Sem impacto negativo no desempenho.  

---

## 📜 **Licença e Direitos**  
Este software é protegido por uma **Licença Proprietária**. Qualquer tentativa de cópia, modificação ou execução fora do ambiente autorizado **é estritamente proibida**. Para mais detalhes, consulte o arquivo `LICENSE`.  

📧 Para suporte ou permissões especiais, entre em contato:  
**Erick Barbosa – erickbsasaki@gmail.com**  

---
