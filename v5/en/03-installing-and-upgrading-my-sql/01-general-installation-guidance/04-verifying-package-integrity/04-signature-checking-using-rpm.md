#### 2.1.4.4 Verificação de Assinatura Usando RPM

Para pacotes RPM, não há uma assinatura separada. Pacotes RPM possuem uma assinatura GPG e um MD5 checksum integrados. Você pode verificar um pacote executando o seguinte comando:

```sql
$> rpm --checksig package_name.rpm
```

Exemplo:

```sql
$> rpm --checksig mysql-community-server-5.7.44-1.el8.x86_64.rpm
MySQL-server-5.7.44-1.el8.x86_64.rpm: digests signatures OK
```

Nota

Se você estiver usando o RPM 4.1 e ele reclamar sobre `(GPG) NOT OK (MISSING KEYS: GPG#3a79bd29)`, mesmo que você tenha importado a chave de compilação pública do MySQL para o seu GPG keyring pessoal, você precisará importar a chave para o RPM keyring primeiro. O RPM 4.1 não usa mais o seu GPG keyring pessoal (ou o próprio GPG). Em vez disso, o RPM mantém um keyring separado porque é uma aplicação de âmbito de sistema e o GPG public keyring de um usuário é um arquivo específico do usuário. Para importar a chave pública do MySQL para o RPM keyring, primeiro obtenha a chave e, em seguida, use **rpm --import** para importá-la. Por exemplo:

```sql
$> gpg --export -a 3a79bd29 > 3a79bd29.asc
$> rpm --import 3a79bd29.asc
```

Como alternativa, o **rpm** também suporta o carregamento da chave diretamente de uma URL:

```sql
$> rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql-2022
```

Você também pode obter a chave pública do MySQL nesta página do manual: Seção 2.1.4.2, “Verificação de Assinatura Usando GnuPG”.