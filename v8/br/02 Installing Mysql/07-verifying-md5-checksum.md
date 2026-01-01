#### 2.1.4.1 Verificar o checksum MD5

Depois de baixar um pacote do MySQL, você deve garantir que seu checksum MD5 corresponda ao fornecido nas páginas de download do MySQL. Cada pacote tem um checksum individual que você pode verificar contra o pacote que você baixou. O checksum MD5 correto está listado na página de downloads para cada produto do MySQL; você deve compará-lo com o checksum MD5 do arquivo (produto) que você baixa.

Cada sistema operacional e configuração oferece sua própria versão de ferramentas para verificar o checksum MD5. Tipicamente, o comando é chamado `md5sum`, ou pode ser chamado `md5`, e alguns sistemas operacionais não o fornecem. No Linux, ele faz parte do pacote **GNU Text Utilities**, que está disponível para uma ampla gama de plataformas. Você também pode baixar o código-fonte de <http://www.gnu.org/software/textutils/>. Se você tiver o OpenSSL instalado, pode usar o comando `openssl md5 package_name` em vez disso. Uma implementação do utilitário de linha de comando `md5` para Windows está disponível em <http://www.fourmilab.ch/md5/>. `winMd5Sum` é uma ferramenta gráfica de verificação de MD5 que pode ser obtida em <http://www.nullriver.com/index/products/winmd5sum>. Nossos exemplos para o Microsoft Windows assumem o nome `md5.exe`.

Exemplos para Linux e Microsoft Windows:

```bash
$> md5sum mysql-standard-8.4.6-linux-i686.tar.gz
aaab65abbec64d5e907dcd41b8699945  mysql-standard-8.4.6-linux-i686.tar.gz
```

```bash
$> md5.exe mysql-installer-community-8.4.6.msi
aaab65abbec64d5e907dcd41b8699945  mysql-installer-community-8.4.6.msi
```

Você deve verificar se o checksum resultante (a string de dígitos hexadecimais) corresponde ao exibido na página de download logo abaixo do respectivo pacote.

::: info Nota
Certifique-se de verificar o checksum do *arquivo de armazém* (por exemplo, o arquivo `.zip`, `.tar.gz` ou `.msi`) e não dos arquivos que estão contidos dentro do arquivo. Em outras palavras, verifique o arquivo antes de extraí-lo.
:::