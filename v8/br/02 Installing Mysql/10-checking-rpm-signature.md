#### 2.1.4.4 Verificação de assinatura usando RPM

Para pacotes RPM, não há uma assinatura separada. Os pacotes RPM possuem uma assinatura GPG embutida e um checksum MD5. Você pode verificar um pacote executando o seguinte comando:

```bash
$> rpm --checksig package_name.rpm
```

Exemplo:

```bash
$> rpm --checksig mysql-community-server-8.4.6-1.el8.x86_64.rpm
mysql-community-server-8.4.6-1.el8.x86_64.rpm: digests signatures OK
```

::: info Nota

Se você estiver usando o RPM 4.1 e ele reclamar sobre `(GPG) NOT OK (MISSING KEYS: GPG#a8d3785c)`, mesmo que você tenha importado a chave de construção pública do MySQL em seu próprio conjunto de chaves GPG, você precisa importar a chave no conjunto de chaves RPM primeiro. O RPM 4.1 não usa mais seu conjunto de chaves GPG pessoal (ou o GPG em si). Em vez disso, o RPM mantém um conjunto de chaves separado porque é um aplicativo de nível de sistema e o conjunto de chaves públicas GPG de um usuário é um arquivo específico do usuário. Para importar a chave pública do MySQL no conjunto de chaves RPM, obtenha a chave primeiro, em seguida, use `rpm --import` para importar a chave. Por exemplo:

```bash
$> gpg --export -a a8d3785c > a8d3785c.asc
$> rpm --import a8d3785c.asc
```

Alternativamente, o `rpm` também suporta o carregamento da chave diretamente de um URL:

```
$> rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql-2023
```

Você também pode obter a chave pública do MySQL desta página do manual: Seção 2.1.4.2, “Verificação de assinatura usando GnuPG”.