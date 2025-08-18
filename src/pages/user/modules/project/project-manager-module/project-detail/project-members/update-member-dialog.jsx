import { useTranslation } from 'react-i18next';
import useDialog from '@hooks/use-dialog';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import {
    Button,
} from '@mui/material';
import FormDialog from '@components/dialog/form-dialog';
import SelectField from '@components/form/select-field';
import { joiResolver } from '@hookform/resolvers/joi';
import toast from '@hooks/toast';
import ProjectService from '@services/project-module-service/project.service';
import { projectMemberSchema } from '@validations/project-schema';
import { PROJECT_MEMBER_ROLE } from '@configs/const.config';

function UpdatateMemberDialog({ projectId, member, refetch }) {
    const { t } = useTranslation();
    const dialog = useDialog();

    const form = useForm({
        resolver: joiResolver(projectMemberSchema),
        defaultValues: member
    });

    const { control } = form;

    const mutation = useMutation({
        mutationFn: async (data) => {
            const [res, err] = await ProjectService.updateMemberRole(projectId, data.employeeId, data.role);
            if (err) throw new Error(err.code);
            return res;
        },
        onSuccess: (res) => {
            refetch();
            dialog.close();
            toast.success(res.code);
        },
    });

    return (
        <FormDialog
            title="working.project.detail.member.update-member-title"
            submitButtonText="common.create"
            form={form}
            mutation={mutation}
            dialog={dialog}
            triggerButton={<Button
                variant="text"
                color="primary"
                onClick={dialog.open}
            >
                {t("common.edit")}
            </Button>}
        >
            <SelectField
                name="role"
                control={control}
                label={t("model.project.project.role")}
                options={Object.keys(PROJECT_MEMBER_ROLE).map((status) => {
                    const { code, label } = PROJECT_MEMBER_ROLE[status];
                    return {
                        value: code,
                        label: label,
                    }
                })}
            />
        </ FormDialog>
    );
}

export default UpdatateMemberDialog;