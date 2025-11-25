document.addEventListener('alpine:init', () => {
        Alpine.data('menus', () => ({
            items: [
                { id: 1, name: 'Mie Sop', img: 'miesop.jpg', price:13000 },
                { id: 2, name: 'Mie Level', img: 'mielevel.jpg', price:13000 },
                { id: 3, name: 'Pisang Coklat', img: 'pisangcoklat.jpg', price:13000 },
                { id: 4, name: 'Nugget', img: 'nuget.jpg', price:13000 },
                { id: 5, name: 'Sosis', img: 'sosis.jpg', price:13000 },
                { id: 6, name: 'Pisang Susu', img: 'pisangsusu.jpg', price:13000 },
                { id: 7, name: 'Dimsum', img: 'dimsum.jpg', price:13000 },
                { id: 8, name: 'Sosis Mie', img: 'sosismie.jpg', price:13000 },
                { id: 9, name: 'Bakpao', img: 'bakpao.jpg', price:13000 },
                { id: 10, name: 'Tahu Walik', img: 'tahuwalik.jpg', price:13000 },
            ],         
        }));

        Alpine.store('cart', {
            items: [], 
            total: 0,
            quantity: 0,
            add(newItem) {
                //cek apakah ada barang tang sama di cart
                const cartItem = this.items.find((item) => item.id === newItem.id);
                //jika belum ada
                if(!cartItem) {
                this.items.push({ ...newItem, quantity: 1, total: newItem.price });
                this.quantity++;
                this.total += newItem.price;
                } else {
                  //cek apakah barang beda atau sama dengan yang ada di cart
                  this.items = this.items.map((item) => {
                    //jika barang beda
                    if(item.id !== newItem.id) {
                        return item;
                    } else {
                        //barang udah ada, tambah quantity dan subtotal
                        item.quantity++;
                        item.total = item.price * item.quantity;
                        this.quantity++;
                        this.total += item.price;
                        return item;
                    }
                  })
                }
            },
            remove(id) {
                //ambil item yang mau diremove berdasarkan id
                const cartItem = this.items.find((item) => item.id === id);
                //jika item lebih dari 1
                if(cartItem.quantity > 1) {
                    //telusuri 1 1
                    this.items = this.items.map((item) => {
                        //jika bukan barang yang diklik
                        if(item.id !== id) {
                            return item;
                        } else {
                            item.quantity--;
                            item.total = item.price * item.quantity;
                            this.quantity--;
                            this.total -= item.price;
                            return item;
                        }
                    })
                } else if (cartItem.quantity === 1) {
                    //jika barangnya tinggal 1
                    this.items = this.items.filter((item) => item.id !== id);
                    this.quantity--;
                    this.total-= cartItem.price;
                }
            }
        });
    });

// form validation
const checkoutButton = document.querySelector('.checkout-button');
checkoutButton.disabled = true;

const form = document.querySelector('#checkoutform');

form.addEventListener('keyup', function() {
    for (let i= 0; i < form.elements.length; i++) {
        if(form.elements[i].value.length !== 0) {
            checkoutButton.classList.remove('disabled');
            checkoutButton.classList.add('disabled');
        } else {
            return false;
        }
    }
    checkoutButton.disabled = false;
    checkoutButton.classList.remove('disabled');
});

//mengirim data ketika tombol checkout diklik
checkoutButton.addEventListener('click', function(e) {
    e.preventDefault();
    const formData = new FormData(form);
    const data = new URLSearchParams(formData);
    const objData = Object.fromEntries(data);
    const massage = formMassage(objData);
    window.open('http://wa.me/6281262482177?text=' + encodeURIComponent(massage));
});

//format untuk kirim pesan whatsapp
const formMassage = (obj) => {
    return `Data Customer
        Nama: ${obj.name}
        Email: ${obj.email}
        Alamat: ${obj.alamat}
        No.Hp: ${obj.phone}
Data pesanan
    ${JSON.parse(obj.items).map((item) => `${item.name} (${item.quantity} x ${rupiah(item.total)}) \n`)}
    Total: ${rupiah(obj.total)}
    Terima Kasih.`;
}

// konversi ke rupiah
const rupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
};


// CONTACT FORM WA CHECK + VALIDASI

document.addEventListener("DOMContentLoaded", () => {

    const contactButton = document.querySelector("#contact button.btn");

    if (!contactButton) return;

    contactButton.addEventListener("click", function(e) {
        e.preventDefault();

        const cart = Alpine.store('cart');

        // eranjang kosong
        if (cart.items.length === 0) {
            alert("Keranjang kosong! Silakan pilih menu dulu.");
            window.location.href = "#menu";
            return;
        }

        // Ambil input form
        const name = document.querySelector('#contact input[name="nama"]').value;
        const email = document.querySelector('#contact input[name="email"]').value;
        const alamat = document.querySelector('#contact input[name="alamat"]').value;
        const phone = document.querySelector('#contact input[name="phone"]').value;


        // Form wajib diisi
        if (name === "" || email === "" || phone === "") {
            alert("Semua form harus diisi terlebih dahulu!");
            return;
        }

        // Pesan WhatsApp
        const message = `
        DATA CUSTOMER
        Nama: ${name}
        Email: ${email}
        Alamat: ${alamat}
        No HP: ${phone}
        DATA PESANAN
        ${cart.items.map(i => `${i.name} (${i.quantity} x ${rupiah(i.total)})`).join("\n")}
        TOTAL: ${rupiah(cart.total)}
        Terima kasih.`;

        // ✔ Buka WhatsApp
        window.open("https://wa.me/6281262482177?text=" + encodeURIComponent(message));

        // Kosongkan keranjang setelah checkout
        cart.items = [];
        cart.quantity = 0;
        cart.total = 0;
    });
});
