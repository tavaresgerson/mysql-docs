#### 2.1.4.4 Verificação da assinatura utilizando RPM

Para pacotes RPM, não há uma assinatura separada. Pacotes RPM têm uma assinatura GPG embutida e checksum MD5. Você pode verificar um pacote executando o seguinte comando:

```
$> rpm --checksig package_name.rpm
```

Exemplo:

```
$> rpm --checksig mysql-community-server-8.4.6-1.el8.x86_64.rpm
mysql-community-server-8.4.6-1.el8.x86_64.rpm: digests signatures OK
```

::: info Note

Se você estiver usando o RPM 4.1 e ele se queixar de `(GPG) NOT OK (MISSING KEYS: GPG#a8d3785c)`, mesmo que você tenha importado a chave de compilação pública do MySQL para sua própria chave de GPG, você precisa importar a chave para a chave de RPM primeiro. O RPM 4.1 não usa mais sua chave de GPG pessoal (ou a própria GPG). Em vez disso, o RPM mantém uma chave de chave separada porque é um aplicativo de todo o sistema e a chave de chave pública do GPG de um usuário é um arquivo específico do usuário. Para importar a chave pública do MySQL para a chave de RPM, primeiro obtenha a chave, em seguida, use **rpm --import** para importar a chave. Por exemplo:

:::

```
$> gpg --export -a a8d3785c > a8d3785c.asc
$> rpm --import a8d3785c.asc
```

Alternativamente, **rpm** também suporta o carregamento da chave diretamente de um URL:

```
$> rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql-2023
```

Você também pode obter a chave pública do MySQL nesta página do manual: Seção 2.1.4.2,  Verificação de assinatura usando GnuPG.
