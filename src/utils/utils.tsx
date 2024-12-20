export function generateLabel({
  name,
  price,
  salePrice,
  barcode,
  size,
  brand,
}: any) {
  // Open a new tab
  const newTab = window.open("", "_blank");
  if (!newTab) return;

  // Add content to the new tab
  const content = `
    <html>
      <head>
        <title>Product Label</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #fff;
          }
          .label-container {
            width: 250px;
            padding: 16px;
            border: 1px solid #000;
            margin: auto;
            line-height: 1.5;
          }
          .header {
            text-align: center;
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 8px;
          }
          .info {
            font-size: 12px;
          }
          .info strong {
            font-weight: bold;
          }
          .info p {
            margin: 4px 0;
          }
          .price {
            font-size: 14px;
            font-weight: bold;
          }
          .barcode {
            text-align: center;
            margin-top: 8px;
          }
          .barcode-title {
            font-size: 10px;
            margin-bottom: 4px;
          }
          .barcode img {
            max-width: 100%;
          }
          .footer {
            font-size: 10px;
            text-align: center;
            margin-top: 12px;
          }
        </style>
      </head>
      <body>
        <div class="label-container">
          <div class="header">Mix Bunch</div>
          <div class="info"> 
            <p>(A Private Limited Company)</p>
            <p>Registered Office:</p> 
            <p>Shop No. 10,Mix Bunch, Fortune Air, Krunal Char rasta,</p>
            <p> Laxmipura, Gotri, Vadodara, Gujarat 390021</p>
            <p><strong>Marketed by: Mix Bunch</strong></p>   
          </div>
          <div class="info">
            <p><strong>Product:</strong> ${name}</p>  
             <p><strong>Size:</strong> ${size}</p>  
             <p><strong>Brand:</strong> ${brand}</p>  
            <p class="price">MRP: ₹${
              price ? price : salePrice
            } (Inclusive of all taxes)</p>
          </div>
          <div class="barcode">
            <p class="barcode-title"><strong>Barcode:</strong></p>
            <img src="https://barcode.tec-it.com/barcode.ashx?data=${barcode}&code=Code128" alt="Barcode" />
          </div>
          <div class="footer">
            <p>For complaints please contact:</p>
            <p>Customer Care Executive</p>
            <p>Contact: 7043745089</p>
            <p>Email: support@mixbunch.in</p>
            <p>GSTIN:24IZRPK5753C1Z1</p> 
            <p>Open Throughout the Week</p>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </div>
      </body>
    </html>
  `;

  newTab.document.open();
  newTab.document.write(content);
  newTab.document.close();
}

// Wrapper function
export const handleGenerateLabel = (product: any) => {
  generateLabel({
    name: product.productName,
    price: product.price,
    salePrice: product.salePrice,
    barcode: product.sku || product._id,
    size: product.sizeOptions || "medium",
    brand: product.brand,
  });
};
