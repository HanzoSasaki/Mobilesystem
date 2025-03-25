 // Variáveis globais
 let suppliers = JSON.parse(localStorage.getItem('suppliers')) || [];
 let orderItems = [];
 let currentEditIndex = null; // Armazena o índice do item em edição

 // Função para salvar os fornecedores no localStorage
 function saveSuppliers() {
   localStorage.setItem('suppliers', JSON.stringify(suppliers));
 }

 // Cadastro de fornecedor
 document.getElementById('supplierForm').addEventListener('submit', function(e) {
   e.preventDefault();
   const cnpj = document.getElementById('supplierCNPJ').value.trim();
   const name = document.getElementById('supplierName').value.trim();
   const items = document.getElementById('supplierItems').value.split(',').map(item => item.trim());
   const supplier = { cnpj, name, items };
   suppliers.push(supplier);
   saveSuppliers();
   alert('Fornecedor cadastrado com sucesso!');
   this.reset();
   renderSearchResults('');
 });

 // Atualiza os resultados de busca
 document.getElementById('searchInput').addEventListener('input', function() {
   renderSearchResults(this.value.trim().toLowerCase());
 });

 function renderSearchResults(query) {
   const resultsDiv = document.getElementById('searchResults');
   resultsDiv.innerHTML = '';
   suppliers.forEach((supplier, index) => {
     if (supplier.cnpj.toLowerCase().includes(query) || supplier.name.toLowerCase().includes(query)) {
       const btn = document.createElement('button');
       btn.className = 'list-group-item list-group-item-action';
       btn.textContent = `${supplier.name} - ${supplier.cnpj}`;
       btn.onclick = () => selectSupplier(index);
       resultsDiv.appendChild(btn);
     }
   });
 }

 let selectedSupplierIndex = null;
 function selectSupplier(index) {
   selectedSupplierIndex = index;
   const supplier = suppliers[index];
   document.getElementById('orderSupplier').value = `${supplier.name} (${supplier.cnpj})`;
   alert(`Fornecedor ${supplier.name} selecionado!`);
   // Alterna para a aba de Pedidos
   const pedidosTab = new bootstrap.Tab(document.querySelector('#pedidos-tab'));
   pedidosTab.show();
 }

 // Adiciona um item à lista de pedido
 function addOrderItem() {
   const productName = document.getElementById('productName').value.trim();
   const productQty = document.getElementById('productQty').value.trim();
   if (!productName || !productQty) {
     alert('Preencha o nome do produto e a quantidade.');
     return;
   }
   orderItems.push({ product: productName, quantity: productQty });
   document.getElementById('productName').value = '';
   document.getElementById('productQty').value = '';
   renderOrderItems();
 }

 // Renderiza a tabela de itens do pedido com botões para editar e excluir
 function renderOrderItems() {
   const tbody = document.getElementById('orderItemsBody');
   tbody.innerHTML = '';
   orderItems.forEach((item, index) => {
     const row = document.createElement('tr');

     const cellProduct = document.createElement('td');
     cellProduct.textContent = item.product;
     row.appendChild(cellProduct);

     const cellQty = document.createElement('td');
     cellQty.textContent = item.quantity;
     row.appendChild(cellQty);

     const cellActions = document.createElement('td');
     // Botão de editar (abre modal)
     const editBtn = document.createElement('button');
     editBtn.className = 'btn btn-sm btn-warning';
     editBtn.textContent = 'Editar';
     editBtn.onclick = () => openEditModal(index);
     cellActions.appendChild(editBtn);
     // Botão de excluir
     const delBtn = document.createElement('button');
     delBtn.className = 'btn btn-sm btn-danger';
     delBtn.textContent = 'Excluir';
     delBtn.onclick = () => deleteOrderItem(index);
     cellActions.appendChild(delBtn);

     row.appendChild(cellActions);
     tbody.appendChild(row);
   });
   document.getElementById('orderItemsTable').style.display = orderItems.length ? 'block' : 'none';
 }

 // Abre o modal de edição e preenche os campos com os dados do item
 function openEditModal(index) {
   currentEditIndex = index;
   const item = orderItems[index];
   document.getElementById('editProductName').value = item.product;
   document.getElementById('editProductQty').value = item.quantity;
   const editModal = new bootstrap.Modal(document.getElementById('editModal'));
   editModal.show();
 }

 // Salva as alterações do modal
 function saveEditOrderItem() {
   const novoProduto = document.getElementById('editProductName').value.trim();
   const novaQtd = document.getElementById('editProductQty').value.trim();
   if (!novoProduto || !novaQtd) {
     alert('Preencha ambos os campos.');
     return;
   }
   orderItems[currentEditIndex] = { product: novoProduto, quantity: novaQtd };
   renderOrderItems();
   // Fecha o modal
   const editModalEl = document.getElementById('editModal');
   const modalInstance = bootstrap.Modal.getInstance(editModalEl);
   modalInstance.hide();
 }

 // Função para excluir um item do pedido
 function deleteOrderItem(index) {
   if (confirm("Deseja realmente excluir este item?")) {
     orderItems.splice(index, 1);
     renderOrderItems();
   }
 }

 // Visualização do pedido
 function previewOrder() {
   if (selectedSupplierIndex === null) {
     alert('Selecione um fornecedor na aba Fornecedores.');
     return;
   }
   if (orderItems.length === 0) {
     alert('Adicione ao menos um item ao pedido.');
     return;
   }
   const supplier = suppliers[selectedSupplierIndex];
   let previewHTML = `
     <div class="mb-3 text-center">
       <h3>Pedido de Compra</h3>
     </div>
     <p><strong>Fornecedor:</strong> ${supplier.name}</p>
     <p><strong>CNPJ:</strong> ${supplier.cnpj}</p>
     <hr>
     <h5>Itens do Pedido</h5>
     <table class="table table-bordered">
       <thead>
         <tr>
           <th>Produto</th>
           <th>Quantidade</th>
         </tr>
       </thead>
       <tbody>
   `;
   orderItems.forEach(item => {
     previewHTML += `<tr><td>${item.product}</td><td>${item.quantity}</td></tr>`;
   });
   previewHTML += `</tbody></table>`;
   document.getElementById('orderPreview').innerHTML = previewHTML;
   document.getElementById('orderPreviewSection').style.display = 'block';
 }

 // Salva o pedido no localStorage
 function saveOrderToLocalStorage(orderData) {
   let orders = JSON.parse(localStorage.getItem('orders')) || [];
   orders.push(orderData);
   localStorage.setItem('orders', JSON.stringify(orders));
 }

 // Geração do PDF com layout estilizado e salvando o pedido
 async function generatePDF() {
   const { jsPDF } = window.jspdf;
   const doc = new jsPDF('p', 'pt', 'a4');

   // Definindo margens e largura útil
   const margin = 40;
   const pageWidth = doc.internal.pageSize.getWidth();
   const usableWidth = pageWidth - margin * 2;
   let y = margin;

   // Cabeçalho centralizado
   doc.setFontSize(16);
   doc.setFont("helvetica", "normal");
   doc.text("Pedido De Orçamento - Moras & Barbosa Ltda", pageWidth / 2, y, { align: "center" });
   y += 16;

   doc.setFontSize(12);
   doc.setFont("helvetica", "bold");
   doc.text("CNPJ: 40.811.585/0001-44", pageWidth / 2, y, { align: "center" });
   y += 20;

   // Mensagem padrão
   const hoje = new Date();
   const dataFormatada = hoje.toLocaleDateString('pt-BR');
   const mensagem = `Olá, espero que se encontre bem ao receber esse pedido. Segue abaixo um resumo de todos os itens que vou precisar para minha próxima compra na data de ${dataFormatada}.\n\nPara possíveis negociações, peço encarecidamente que entre em contato com nosso representante de compras no WhatsApp.`;
   doc.setFont("helvetica", "normal");
   doc.setFontSize(10);
   const splitMsg = doc.splitTextToSize(mensagem, usableWidth);
   doc.text(splitMsg, margin, y);
   y += (splitMsg.length * 10) + 20;

   // Tabela dos itens do pedido com jsPDF-AutoTable
   const tableColumns = ["Produto", "Quantidade"];
   const tableData = orderItems.map(item => [item.product, item.quantity]);
   doc.autoTable({
     head: [tableColumns],
     body: tableData,
     startY: y,
     margin: { left: margin, right: margin },
     theme: 'grid',
     headStyles: { fillColor: [0, 123, 255], halign: 'center' },
     styles: { fontSize: 10, halign: 'center' }
   });
   y = doc.lastAutoTable.finalY + 20;

   // Texto final no rodapé
   const footerText = `Declaro que a necessidade do valor do pedido, como resposta para uma cotação completa dos itens, agradeço desde já.\n\nMoras & Barbosa commerce`;
   const splitFooter = doc.splitTextToSize(footerText, usableWidth);
   doc.text(splitFooter, margin, y);

   // Salva o PDF
   doc.save('pedido-compra.pdf');

   // Salva o pedido no localStorage (dados do fornecedor e itens)
   const supplier = suppliers[selectedSupplierIndex];
   const orderData = {
     supplier,
     orderItems,
     data: dataFormatada
   };
   saveOrderToLocalStorage(orderData);

   // Limpa os dados do pedido para um novo orçamento
   novoPedido();

   alert("Pedido finalizado e salvo com sucesso!");
 }

 // Função para iniciar um novo pedido (limpa os campos e itens)
 function novoPedido() {
   orderItems = [];
   renderOrderItems();
   document.getElementById('orderItemsTable').style.display = 'none';
   document.getElementById('orderPreviewSection').style.display = 'none';
   document.getElementById('orderSupplier').value = '';
   selectedSupplierIndex = null;
 }

 // Ao carregar a página, renderiza os fornecedores salvos
 window.addEventListener('load', () => {
   renderSearchResults('');
 });