#### 2.1.4.4 Verificação da assinatura utilizando RPM

Para pacotes RPM, não há uma assinatura separada. Pacotes RPM têm uma assinatura GPG embutida e checksum MD5. Você pode verificar um pacote executando o seguinte comando:

```bash
$> rpm --checksig package_name.rpm
```

Exemplo:

```bash
$> rpm --checksig mysql-community-server-8.4.6-1.el8.x86_64.rpm
mysql-community-server-8.4.6-1.el8.x86_64.rpm: digests signatures OK
```

::: info Note

Se você estiver usando o RPM 4.1 e ele se queixar de `(GPG) NOT OK (MISSING KEYS: GPG#a8d3785c)`, mesmo que você tenha importado a chave de compilação pública do MySQL para o seu próprio keyring GPG, você precisa importar a chave para o keyring RPM primeiro. RPM 4.1 não usa mais o seu keyring GPG pessoal (ou o próprio GPG). Em vez disso, o RPM mantém um keyring separado porque é uma aplicação em todo o sistema e o keyring público do GPG de um usuário é um arquivo específico do usuário. Para importar a chave pública do MySQL para o keyring RPM, primeiro obtenha a chave, e depois use `rpm --import` para importar a chave. Por exemplo:

:::

```bash
$> gpg --export -a a8d3785c > a8d3785c.asc
$> rpm --import a8d3785c.asc
```

Alternativamente, `rpm` também suporta o carregamento da chave diretamente de um URL:

```
$> rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql-2023
```

Você também pode obter a chave pública do MySQL nesta página do manual: Seção 2.1.4.2,  Verificação de assinatura usando GnuPG.
