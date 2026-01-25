#### 2.1.4.1 Verificando o MD5 Checksum

Após baixar um pacote MySQL, você deve garantir que seu MD5 checksum corresponda ao fornecido nas páginas de download do MySQL. Cada pacote possui um checksum individual que você pode verificar em relação ao pacote que baixou. O MD5 checksum correto está listado na página de downloads de cada produto MySQL; compare-o com o MD5 checksum do arquivo (produto) que você está baixando.

Cada sistema operacional e configuração oferece sua própria versão de ferramentas para verificar o MD5 checksum. Normalmente, o comando é chamado de **md5sum**, ou pode ser chamado de **md5**, e alguns sistemas operacionais nem o incluem. No Linux, ele faz parte do pacote **GNU Text Utilities**, que está disponível para uma ampla variedade de plataformas. Você também pode baixar o código fonte em <http://www.gnu.org/software/textutils/>. Se você tiver o OpenSSL instalado, poderá usar o comando **openssl md5 *`package_name`*** como alternativa. Uma implementação para Windows do utilitário de linha de comando **md5** está disponível em <http://www.fourmilab.ch/md5/>. O **winMd5Sum** é uma ferramenta gráfica de verificação de MD5 que pode ser obtida em <http://www.nullriver.com/index/products/winmd5sum>. Nossos exemplos para Microsoft Windows assumem o nome **md5.exe**.

Exemplos para Linux e Microsoft Windows:

```sql
$> md5sum mysql-standard-5.7.44-linux-i686.tar.gz
aaab65abbec64d5e907dcd41b8699945  mysql-standard-5.7.44-linux-i686.tar.gz
```

```sql
$> md5.exe mysql-installer-community-5.7.44.msi
aaab65abbec64d5e907dcd41b8699945  mysql-installer-community-5.7.44.msi
```

Você deve verificar se o checksum resultante (a string de dígitos hexadecimais) corresponde ao exibido na página de download, imediatamente abaixo do respectivo pacote.

**Nota**

Certifique-se de verificar o checksum do *arquivo de Archive* (por exemplo, o arquivo `.zip`, `.tar.gz` ou `.msi`) e não dos arquivos que estão contidos dentro do Archive. Em outras palavras, verifique o arquivo antes de extrair seu conteúdo.