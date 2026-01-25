### 2.1.4 Verificando a Integridade do Package Usando MD5 Checksums ou GnuPG

2.1.4.1 Verificando o MD5 Checksum

2.1.4.2 Verificação de Assinatura Usando GnuPG

2.1.4.3 Verificação de Assinatura Usando Gpg4win para Windows

2.1.4.4 Verificação de Assinatura Usando RPM

2.1.4.5 GPG Public Build Key para Packages Arquivados

Após fazer o download do package MySQL que atenda às suas necessidades e antes de tentar instalá-lo, certifique-se de que ele esteja intacto e não tenha sido adulterado. Existem três meios de verificação de integridade:

* MD5 checksums
* Assinaturas criptográficas usando `GnuPG`, o GNU Privacy Guard

* Para packages RPM, o mecanismo de verificação de integridade RPM integrado

As seções a seguir descrevem como usar esses métodos.

Se você notar que o MD5 checksum ou as assinaturas GPG não correspondem, tente primeiro fazer o download do package respectivo mais uma vez, talvez de outro mirror site.