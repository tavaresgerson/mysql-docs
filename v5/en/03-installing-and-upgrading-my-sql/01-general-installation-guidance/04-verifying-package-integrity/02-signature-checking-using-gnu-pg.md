#### 2.1.4.2 Verificação de Signature Usando GnuPG

Outro método de verificar a integridade e autenticidade de um pacote é usar signatures criptográficas. Isso é mais confiável do que usar MD5 checksums, mas exige mais trabalho.

Nós assinamos pacotes MySQL disponíveis para download com **GnuPG** (GNU Privacy Guard). O **GnuPG** é uma alternativa Open Source ao conhecido Pretty Good Privacy (**PGP**) de Phil Zimmermann. A maioria das distribuições Linux é fornecida com o **GnuPG** instalado por padrão. Caso contrário, consulte <http://www.gnupg.org/> para obter mais informações sobre o **GnuPG** e como obtê-lo e instalá-lo.

Para verificar a signature de um pacote específico, você precisa primeiro obter uma cópia da nossa public GPG build key, que pode ser baixada em <http://pgp.mit.edu/>. A key que você deseja obter se chama `mysql-build@oss.oracle.com`. O keyID para pacotes MySQL 5.7.37 e superiores é `3A79BD29`. Após obter esta key, você deve compará-la com a key mostrada a seguir, antes de usá-la para verificar pacotes MySQL. Alternativamente, você pode copiar e colar a key diretamente do texto abaixo.

Nota

A seguinte public GPG build key é para pacotes MySQL 5.7.37 e superiores. Para a public GPG build key de pacotes de versões anteriores do MySQL (keyID `5072E1F5`), consulte a Seção 2.1.4.5, “GPG Public Build Key para Pacotes Arquivados”.

```sql
-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: SKS 1.1.6
Comment: Hostname: pgp.mit.edu

mQINBGG4urcBEACrbsRa7tSSyxSfFkB+KXSbNM9rxYqoB78u107skReefq4/+Y72TpDvlDZL
mdv/lK0IpLa3bnvsM9IE1trNLrfi+JES62kaQ6hePPgn2RqxyIirt2seSi3Z3n3jlEg+mSdh
AvW+b+hFnqxo+TY0U+RBwDi4oO0YzHefkYPSmNPdlxRPQBMv4GPTNfxERx6XvVSPcL1+jQ4R
2cQFBryNhidBFIkoCOszjWhm+WnbURsLheBp757lqEyrpCufz77zlq2gEi+wtPHItfqsx3rz
xSRqatztMGYZpNUHNBJkr13npZtGW+kdN/xu980QLZxN+bZ88pNoOuzD6dKcpMJ0LkdUmTx5
z9ewiFiFbUDzZ7PECOm2g3veJrwr79CXDLE1+39Hr8rDM2kDhSr9tAlPTnHVDcaYIGgSNIBc
YfLmt91133klHQHBIdWCNVtWJjq5YcLQJ9TxG9GQzgABPrm6NDd1t9j7w1L7uwBvMB1wgpir
RTPVfnUSCd+025PEF+wTcBhfnzLtFj5xD7mNsmDmeHkF/sDfNOfAzTE1v2wq0ndYU60xbL6/
yl/Nipyr7WiQjCG0m3WfkjjVDTfs7/DXUqHFDOu4WMF9v+oqwpJXmAeGhQTWZC/QhWtrjrNJ
AgwKpp263gDSdW70ekhRzsok1HJwX1SfxHJYCMFs2aH6ppzNsQARAQABtDZNeVNRTCBSZWxl
YXNlIEVuZ2luZWVyaW5nIDxteXNxbC1idWlsZEBvc3Mub3JhY2xlLmNvbT6JAlQEEwEIAD4W
IQSFm+jXxYb1OEMLGcJGe5QtOnm9KQUCYbi6twIbAwUJA8JnAAULCQgHAgYVCgkICwIEFgID
AQIeAQIXgAAKCRBGe5QtOnm9KUewD/992sS31WLGoUQ6NoL7qOB4CErkqXtMzpJAKKg2jtBG
G3rKE1/0VAg1D8AwEK4LcCO407wohnH0hNiUbeDck5x20pgS5SplQpuXX1K9vPzHeL/WNTb9
8S3H2Mzj4o9obED6Ey52tTupttMF8pC9TJ93LxbJlCHIKKwCA1cXud3GycRN72eqSqZfJGds
aeWLmFmHf6oee27d8XLoNjbyAxna/4jdWoTqmp8oT3bgv/TBco23NzqUSVPi+7ljS1hHvcJu
oJYqaztGrAEf/lWIGdfl/kLEh8IYx8OBNUojh9mzCDlwbs83CBqoUdlzLNDdwmzu34Aw7xK1
4RAVinGFCpo/7EWoX6weyB/zqevUIIE89UABTeFoGih/hx2jdQV/NQNthWTW0jH0hmPnajBV
AJPYwAuO82rx2pnZCxDATMn0elOkTue3PCmzHBF/GT6c65aQC4aojj0+Veh787QllQ9FrWbw
nTz+4fNzU/MBZtyLZ4JnsiWUs9eJ2V1g/A+RiIKu357Qgy1ytLqlgYiWfzHFlYjdtbPYKjDa
ScnvtY8VO2Rktm7XiV4zKFKiaWp+vuVYpR0/7Adgnlj5Jt9lQQGOr+Z2VYx8SvBcC+by3XAt
YkRHtX5u4MLlVS3gcoWfDiWwCpvqdK21EsXjQJxRr3dbSn0HaVj4FJZX0QQ7WZm6WLkCDQRh
uLq3ARAA6RYjqfC0YcLGKvHhoBnsX29vy9Wn1y2JYpEnPUIB8X0VOyz5/ALv4Hqtl4THkH+m
mMuhtndoq2BkCCk508jWBvKS1S+Bd2esB45BDDmIhuX3ozu9Xza4i1FsPnLkQ0uMZJv30ls2
pXFmskhYyzmo6aOmH2536LdtPSlXtywfNV1HEr69V/AHbrEzfoQkJ/qvPzELBOjfjwtDPDeP
iVgW9LhktzVzn/BjO7XlJxw4PGcxJG6VApsXmM3t2fPN9eIHDUq8ocbHdJ4en8/bJDXZd9eb
QoILUuCg46hE3p6nTXfnPwSRnIRnsgCzeAz4rxDR4/Gv1Xpzv5wqpL21XQi3nvZKlcv7J1IR
VdphK66De9GpVQVTqC102gqJUErdjGmxmyCA1OOORqEPfKTrXz5YUGsWwpH+4xCuNQP0qmre
Rw3ghrH8potIr0iOVXFic5vJfBTgtcuEB6E6ulAN+3jqBGTaBML0jxgj3Z5VC5HKVbpg2DbB
/wMrLwFHNAbzV5hj2Os5Zmva0ySP1YHB26pAW8dwB38GBaQvfZq3ezM4cRAo/iJ/GsVE98dZ
EBO+Ml+0KYj+ZG+vyxzo20sweun7ZKT+9qZM90f6cQ3zqX6IfXZHHmQJBNv73mcZWNhDQOHs
4wBoq+FGQWNqLU9xaZxdXw80r1viDAwOy13EUtcVbTkAEQEAAYkCPAQYAQgAJhYhBIWb6NfF
hvU4QwsZwkZ7lC06eb0pBQJhuLq3AhsMBQkDwmcAAAoJEEZ7lC06eb0pSi8P/iy+dNnxrtiE
Nn9vkkA7AmZ8RsvPXYVeDCDSsL7UfhbS77r2L1qTa2aB3gAZUDIOXln51lSxMeeLtOequLME
V2Xi5km70rdtnja5SmWfc9fyExunXnsOhg6UG872At5CGEZU0c2Nt/hlGtOR3xbt3O/Uwl+d
ErQPA4BUbW5K1T7OC6oPvtlKfF4bGZFloHgt2yE9YSNWZsTPe6XJSapemHZLPOxJLnhs3VBi
rWE31QS0bRl5AzlO/fg7ia65vQGMOCOTLpgChTbcZHtozeFqva4IeEgE4xN+6r8WtgSYeGGD
RmeMEVjPM9dzQObf+SvGd58u2z9f2agPK1H32c69RLoA0mHRe7Wkv4izeJUc5tumUY0e8Ojd
enZZjT3hjLh6tM+mrp2oWnQIoed4LxUw1dhMOj0rYXv6laLGJ1FsW5eSke7ohBLcfBBTKnMC
BohROHy2E63Wggfsdn3UYzfqZ8cfbXetkXuLS/OM3MXbiNjg+ElYzjgWrkayu7yLakZx+mx6
sHPIJYm2hzkniMG29d5mGl7ZT9emP9b+CfqGUxoXJkjs0gnDl44bwGJ0dmIBu3ajVAaHODXy
Y/zdDMGjskfEYbNXCAY2FRZSE58tgTvPKD++Kd2KGplMU2EIFT7JYfKhHAB5DGMkx92HUMid
sTSKHe+QnnnoFmu4gnmDU31i
=Xqbo
-----END PGP PUBLIC KEY BLOCK-----
```

Para importar a build key para o seu public GPG keyring pessoal, use **gpg --import**. Por exemplo, se você salvou a key em um arquivo chamado `mysql_pubkey.asc`, o comando de importação se parece com isto:

```sql
$> gpg --import mysql_pubkey.asc
gpg: key 3A79BD29: public key "MySQL Release Engineering
<mysql-build@oss.oracle.com>" imported
gpg: Total number processed: 1
gpg:               imported: 1
gpg: no ultimately trusted keys found
```

Você também pode baixar a key do public keyserver usando o public key id, `3A79BD29`:

```sql
$> gpg --recv-keys 3A79BD29
gpg: requesting key 3A79BD29 from hkp server keys.gnupg.net
gpg: key 3A79BD29: "MySQL Release Engineering <mysql-build@oss.oracle.com>"
1 new user ID
gpg: key 3A79BD29: "MySQL Release Engineering <mysql-build@oss.oracle.com>"
53 new signatures
gpg: no ultimately trusted keys found
gpg: Total number processed: 1
gpg:           new user IDs: 1
gpg:         new signatures: 53
```

Se você deseja importar a key para sua configuração RPM para validar pacotes de instalação RPM, você deve ser capaz de importar a key diretamente:

```sql
$> rpm --import mysql_pubkey.asc
```

Se você tiver problemas ou precisar de informações específicas sobre RPM, consulte a Seção 2.1.4.4, “Signature Checking Usando RPM”.

Depois de baixar e importar a public build key, baixe o pacote MySQL desejado e a signature correspondente, que também está disponível na página de download. O arquivo de signature tem o mesmo nome que o arquivo de distribuição, com a extensão `.asc`, conforme mostrado nos exemplos da tabela a seguir.

**Tabela 2.1 Arquivos de Pacote e Signature do MySQL para Source files**

| Tipo de Arquivo | Nome do Arquivo |
| :--- | :--- |
| Arquivo de Distribuição | `mysql-standard-5.7.44-linux-i686.tar.gz` |
| Arquivo de Signature | `mysql-standard-5.7.44-linux-i686.tar.gz.asc` |

Certifique-se de que ambos os arquivos estejam armazenados no mesmo diretório e, em seguida, execute o seguinte comando para verificar a signature do arquivo de distribuição:

```sql
$> gpg --verify package_name.asc
```

Se o pacote baixado for válido, você deverá ver uma mensagem `Good signature` (Signature válida) semelhante a esta:

```sql
$> gpg --verify mysql-standard-5.7.44-linux-i686.tar.gz.asc
gpg: Signature made Tue 01 Feb 2011 02:38:30 AM CST using DSA key ID 3A79BD29
gpg: Good signature from "MySQL Release Engineering <mysql-build@oss.oracle.com>"
```

A mensagem `Good signature` indica que a file signature é válida quando comparada à signature listada em nosso site. Mas você também pode ver warnings (avisos), como estes:

```sql
$> gpg --verify mysql-standard-5.7.44-linux-i686.tar.gz.asc
gpg: Signature made Wed 23 Jan 2013 02:25:45 AM PST using DSA key ID 3A79BD29
gpg: checking the trustdb
gpg: no ultimately trusted keys found
gpg: Good signature from "MySQL Release Engineering <mysql-build@oss.oracle.com>"
gpg: WARNING: This key is not certified with a trusted signature!
gpg:          There is no indication that the signature belongs to the owner.
Primary key fingerprint: A4A9 4068 76FC BD3C 4567  70C8 8C71 8D3B 5072 E1F5
```

Isso é normal, pois eles dependem da sua setup e configuration. Aqui estão as explicações para esses warnings:

* *gpg: no ultimately trusted keys found*: Isso significa que a key específica não é "ultimately trusted" por você ou pela sua web of trust (teia de confiança), o que é aceitável para os propósitos de verificação de file signatures.

* *WARNING: This key is not certified with a trusted signature! There is no indication that the signature belongs to the owner.*: Isso se refere ao seu nível de confiança na crença de que você possui nossa public key real. Esta é uma decisão pessoal. Idealmente, um desenvolvedor MySQL entregaria a key pessoalmente a você, mas, mais comumente, você a baixou. O download foi adulterado? Provavelmente não, mas esta decisão é sua. Configurar uma web of trust é um método para confiar nelas.

Consulte a documentação do GPG para obter mais informações sobre como trabalhar com public keys.